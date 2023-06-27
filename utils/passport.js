import { sleep } from "./index.js";
import useDidToAddress from "../hooks/useDidToAddress";

/** Will force refresh the passport score */
export async function getPassport(did) {
  const { address, chain } = useDidToAddress(did);
  let score;

  console.log("address:", address);
  /** Submit passport to generate a score */
  try {
    let res = await fetch('https://api.scorer.gitcoin.co/registry/submit-passport', {
      method: 'POST',
      body: JSON.stringify(
        {
          address: address,
          scorer_id: "899"
        }
      ),
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "G5WwLzpf.HCYtZLKZ9yGq4tOnyLf9OYxejgFXxaSb"
      }
    });
    let passport_details = await res.json();
  } catch(e) {
    console.log("Error submitting passport for this scorer: ", e);
  }


  await sleep(3000);

  /** Retrieve passport score */
  try {
    let res_score = await fetch('https://api.scorer.gitcoin.co/registry/score/899/' + address, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "G5WwLzpf.HCYtZLKZ9yGq4tOnyLf9OYxejgFXxaSb"
      }
    });
    let res_score_details = await res_score.json();
    console.log("res_score_details:", res_score_details);
    if(res_score_details.score) {
      score = Number(res_score_details.score);
    } else {
      score = 0;
    }
  } catch(e) {
    console.log("Error retrieving passport score for this scorer: ", e);
  }

  return score;
}
