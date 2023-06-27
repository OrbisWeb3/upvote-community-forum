export default function Upvote({like, active, count}) {
  if(active) {
    return(
      <div className="rounded-md border text-brand-blue border-brand-blue p-4 py-2 mr-4 flex flex-col">
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.840583 10.7C0.210872 11.6989 0.92869 13 2.10947 13L13.8906 13C15.0714 13 15.7892 11.6989 15.1595 10.7L9.26893 1.35638C8.68048 0.422985 7.3196 0.422987 6.73115 1.35638L0.840583 10.7Z" fill="currentColor"/>
        </svg>
        <div className="font-bold text-center mt-1">{count}</div>
      </div>
    )
  } else {
    return(
      <div className="rounded-md border text-primary border-primary hover-border-secondary p-4 py-2 mr-4 cursor-pointer flex-col" onClick={() => like()}>
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.840461 10.7C0.210749 11.6989 0.928568 13 2.10935 13L13.8905 13C15.0713 13 15.7891 11.6989 15.1594 10.7L9.26881 1.35638C8.68036 0.422985 7.31948 0.422987 6.73103 1.35638L0.840461 10.7Z" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/>
        </svg>
        <div className="font-medium text-center mt-1">{count}</div>
      </div>
    )
  }
}
