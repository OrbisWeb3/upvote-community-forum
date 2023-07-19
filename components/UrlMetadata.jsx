import Link from 'next/link';

/** Will display the metadata of a URL */
export default function UrlMetadata({metadata, imgSize = "15rem", showDesc = true}) {
  /** Return domain name for a URL */
  function getDomainName(url) {
    // Remove the protocol (http:// or https://) if present
    let domain = url.replace(/(^\w+:|^)\/\//, '');

    // Remove anything after the first forward slash "/"
    domain = domain.split('/')[0];

    // Remove port number if present
    domain = domain.split(':')[0];

    // Remove "www" subdomain if present
    domain = domain.replace('www.', '');

    return domain;
  }

  /** Return shortened description */
  function getDescription(description) {
    if(description.length < 80) {
      return description
    } else {
      return description.substring(0, 80) + "...";
    }
  }

  return(
    <Link href={metadata.source} target="_blank" className="rounded-md shadow-md bg-secondary flex flex-row overflow-hidden mt-2 mb-3 hover:underline lg:max-w-[80%]">
      {metadata.image &&
        <div className="border-r border-primary bg-cover bg-center" style={{backgroundImage: "url("+metadata.image+")", width: imgSize}}></div>
      }
      <div className="flex flex-col p-4">
        <p className="text-primary text-sm font-medium hover:underline">{metadata.title}</p>
        <p className="text-tertiary text-sm hover:underline">{getDomainName(metadata.source)}</p>
        {(metadata.description && showDesc) &&
          <p className="text-secondary text-sm hover:underline">{getDescription(metadata.description)}</p>
        }
      </div>
    </Link>
  )
}
