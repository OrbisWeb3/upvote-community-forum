import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from "./Badge";
import Upvote from "./Upvote";
import ProofBadge from "./ProofBadge";
import { User, UserBadge, useOrbis } from "@orbisclub/components";
import { shortAddress } from "../utils";
import { ExternalLinkIcon, CommentsIcon } from "./Icons";
import UrlMetadata from "./UrlMetadata";

export default function PostItem({post}) {
  const { orbis, user } = useOrbis();
  const [hasLiked, setHasLiked] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);


  /** Check if user liked this post */
  useEffect(() => {
    if(user) {
      getReaction();
    }

    async function getReaction() {
      let { data, error } = await orbis.getReaction(post.stream_id, user.did);
      if(data && data.type && data.type == "like") {
        setHasLiked(true);
      }
    }
  }, [user]);

  /** Will like / upvote the post */
  async function like() {
    if(user) {
      setHasLiked(true);
      setUpdatedPost({
        ...updatedPost,
        count_likes: post.count_likes + 1
      });
      let res = await orbis.react(
        post.stream_id,
        "like"
      );
      console.log("res:", res);
    } else {
      alert("You must be connected to react to posts.");
    }
  }

  /** Will clean description by shortening it and remove some markdown structure */
  function cleanDescription() {
    if(post.content.body) {
      let desc = post.content.body;
      const regexImage = /\!\[Image ALT tag\]\((.*?)\)/;
      const regexUrl = /\[(.*?)\]\(.*?\)/;
      desc = desc.replace(regexImage, "");
      desc = desc.replace(regexUrl, "$1");


      if(desc) {
        return desc.substring(0,180) + "...";
      } else {
        return null;
      }
    } else {
      return null
    }
  }

  return (
    <div className="[&:nth-child(-n+4)]:-order-1 alte">
      <div className="relative p-5 pl-0 flex flex-row items-start">
        <Upvote like={like} active={hasLiked} count={updatedPost.count_likes} />
        <div className="sm:flex items-center space-y-6 sm:space-y-0 sm:space-x-5">
          <div className="grow text-primary lg:flex items-center justify-between space-y-5 lg:space-x-6 lg:space-y-0">
            <div>
              <div className="mb-2">
                <h2 className="mb-1 alte">
                  <Link className="text-primary text-base font-medium hover:underline" href={"/post/" + post.stream_id}>
                    {post.content.title}
                  </Link>
                </h2>
                <p className="text-sm text-tertiary alte">{cleanDescription()}</p>
                {/** Display URL metadata if any */}
                {post.indexing_metadata?.urlMetadata?.title &&
                  <UrlMetadata showDesc={false} imgSize="10rem" metadata={post.indexing_metadata.urlMetadata} />
                }
              </div>
              <div className="flex items-center text-sm text-secondary flex flex-row space-x-1.5">
                <User details={post.creator_details} height={35} />
                {/**<UserBadge details={post.creator_details}  />*/}
                <span className="text-secondary">in</span>
                {post.context_details?.context_details &&
                  <Badge title={post.context_details.context_details.displayName ? post.context_details.context_details.displayName : post.context_details.context_details.name} color="bg-brand-400" />
                }

                <span className="hidden md:flex text-tertiary mr-2 ml-2">·</span>

                {/** Show count replies if any */}
                {(post.count_replies && post.count_replies > 0) ?
                  <>
                    <Link href={"/post/" + post.stream_id} className="hidden md:flex text-primary text-xs border border-primary px-2 py-1 font-medium text-xs items-center space-y-2 rounded-md hover:border hover:underline">{post.count_replies} <CommentsIcon style={{marginLeft: 3}} /></Link>
                    <span className="hidden md:flex text-tertiary mr-2 ml-2">·</span>
                  </>
                :
                  <></>
                }

                {/** Proof link to Cerscan */}
                {post.stream_id &&
                  <ProofBadge stream_id={post.stream_id} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
