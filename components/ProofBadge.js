import { shortAddress } from "../utils";
import Link from 'next/link';
import { ExternalLinkIcon } from "./Icons";

export default function ProofBadge({stream_id}) {
  return(
    <Link href={"https://cerscan.com/mainnet/stream/" + stream_id} target="_blank" className="hidden md:flex text-primary text-xs border border-primary rounded-md py-1 px-2 font-medium flex flex-row items-center hover:underline"><span className="text-tertiary flex flex-row items-center"><ExternalLinkIcon style={{marginRight: 3}} /> Proof:</span> {shortAddress(stream_id, 8)}</Link>
  )
}
