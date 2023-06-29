import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import PostItem from '../components/PostItem';
import Footer from '../components/Footer';
import { LoadingCircle } from "../components/Icons";
import { Orbis, useOrbis } from "@orbisclub/components";
import useDidToAddress from "../hooks/useDidToAddress";

function Home({defaultPosts}) {
  const { orbis, user } = useOrbis();
  const [nav, setNav] = useState("all");
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(defaultPosts);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /** Load all of the categories (sub-contexts) available in this forum */
  useEffect(() => {
    if(global.orbis_context) {
      loadContexts();
    }


    /** Load all categories / contexts under the global forum context */
    async function loadContexts() {
      let { data, error } = await orbis.api.from("orbis_contexts").select().eq('context', global.orbis_context).order('created_at', { ascending: false });
      setCategories(data);
    }
  }, []);

  /** Will re-load list of posts when navigation is updated */
  useEffect(() => {
    /** Reset page */
    setPage(0);

    /** Load posts */
    if(global.orbis_context) {
      if(nav == "all") {
        loadPosts(global.orbis_context, true, 0);
      } else {
        loadPosts(nav, true, 0);
      }
    }
  }, [nav]);

  /** Will re-load the posts when page is updated */
  useEffect(() => {
    if(global.orbis_context) {
      if(nav == "all") {
        loadPosts(global.orbis_context, true, page);
      } else {
        loadPosts(nav, true, page);
      }
    }
  }, [page]);

  /** Load list of posts using the Orbis SDK */
  async function loadPosts(context, include_child_contexts, _page) {
    setLoading(true);
    let { data, error } = await orbis.api.rpc("get_ranked_posts", { q_context: context }).range(_page * 25, (_page + 1) * 50 - 1);


  /*  let { data, error } = await orbis.getPosts({
      context: context,
      only_master: true,
      order_by: 'count_likes',
      include_child_contexts: include_child_contexts,
    }, _page, 25);*/

    /** Save data in posts state */
    if(data) {
      setPosts(data);
    }

    /** Disable loading state */
    setLoading(false);
  }

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">Make this your own community forum | Orbis</title>
        <meta property="og:title" content="Make this your own community forum | Orbis" key="og_title" />

        {/** Description */}
        <meta name="description" content="Build your own community forum powered by Orbis." key="description"></meta>
        <meta property="og:description" content="Build your own community forum powered by Orbis." key="og_description"/>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip bg-main">
        <div className="antialiased">
          <div className="min-h-screen flex">

            {/*  Page content */}
            <main className="grow overflow-hidden">

              {/*  Site header */}
              <Header />

              {/* Hero section with main title and description */}
              <Hero title="Make this your own community forum!" description="Respectful and good-faith discussion should be the cornerstone of any decision-making process. In trying to enact change, please keep this principle in mind." />

              {/* Page content */}
              <section>

                      {/** Render categories and list of posts if context has already been created otherwise display Dashboard CTA */}
                      {global.orbis_context ?
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                          <div className="md:flex md:justify-between">

                            {/* Main content */}
                            <div className="md:grow pt-3 pb-12 md:pb-20">
                              <div className="md:pr-6 lg:pr-10">
                                <CategoriesNavigation categories={categories} nav={nav} setNav={setNav} />
                                {/** Show loading state or list of posts */}
                                {loading ?
                                  <div className="flex w-full justify-center p-3 text-primary">
                                    <LoadingCircle />
                                  </div>
                                :
                                  <>
                                    {/* Display posts if any */}
                                    {(posts && posts.length > 0) ?
                                      <>
                                        <div className="mb-12">
                                          <div className="flex flex-col space-y-6 mb-8">
                                            {posts.map((post) => {
                                              return (
                                                <PostItem post={post} key={post.stream_id} />
                                              );
                                            })}
                                          </div>

                                          {/* Handle pagination */}
                                          {posts && posts.length >= 25 &&
                                            <div className="text-right">
                                              <button className="btn-sm py-1.5 h-8 btn-secondary btn-secondary-hover" onClick={() => setPage(page + 1)}>
                                                Next page <span className="tracking-normal ml-1">-&gt;</span>
                                              </button>
                                            </div>
                                          }

                                        </div>
                                      </>
                                    :
                                      <div className="w-full text-center bg-white/10 rounded border border-primary bg-secondary p-6">
                                        <p className="text-sm text-secondary">There aren&apos;t any posts shared here.</p>
                                      </div>
                                    }
                                  </>
                                }
                              </div>
                            </div>
                            <Sidebar />
                          </div>
                        </div>
                      :
                        <div className="flex flex-col md:pr-6 lg:pr-10 items-center">
                          <p className="text-base text-primary">To get started you need to create your own context using our Dashboard.</p>
                          <ol className="text-base list-decimal text-sm text-primary list-inside text-center justify-center mt-3 w-2/3">
                            <li className="text-base">Visit our Dashboard and create your own <b>Project</b> and <b>Context</b>.</li>
                            <li className="text-base">Create categories for your community by adding <b>sub-contexts</b> to the context you just created.</li>
                            <li className="text-base">Go into <b>_app.js</b> and update the <b>global.orbis_context</b> value.</li>
                          </ol>
                          <Link href="https://useorbis.com/dashboard" target="_blank" className="btn-sm py-1.5 btn-main mt-6">Go to Dashboard</Link>

                        </div>
                      }



              </section>
            </main>
          </div>
        </div>

        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
}

const CategoriesNavigation = ({ categories, nav, setNav }) => {
  return(
    <div className="border-b border-primary pb-6 mb-6">
      <div className="text-center md:text-left md:flex justify-between items-center">
        {/* Right: Button */}
        <div className="mb-4 md:mb-0 md:order-1 md:ml-6">
          <Link className="btn-sm py-1.5 btn-brand" href="/create">Create Post</Link>
        </div>

        {/* Left: Links */}
        <ul className="grow inline-flex flex-wrap text-sm font-medium -mx-3 -my-1">
          <NavItem selected={nav} category={{stream_id: "all", content: {displayName: "All"}}} onClick={setNav} />
          {categories.map((category, key) => {
            return (
              <NavItem key={key} selected={nav} category={category} onClick={setNav} />
            );
          })}
        </ul>
      </div>
    </div>
  )
}

const NavItem = ({selected, category, onClick}) => {
  return(
    <li className="px-3 py-1">
      <span className={`relative transition duration-150 ease-in-out ${selected == category.stream_id ? "text-brand underline underline-offset-4" : "cursor-pointer text-secondary hover:underline"}`} onClick={() => onClick(category.stream_id)}>{category.content.displayName}</span>
    </li>
  )
}

export default Home;
