import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tool Generator - Home'
}

export default async function Home() {
  const status = await fetch(
    `${process.env.API_URL}/status`,
    {
      method: "GET",
      cache: "no-cache"
    }
  ).then(res => res.status)
    .catch(() => 404);

  let statusElement;
  switch (status) {
    case 204:
      statusElement = <div className='badge p-4 bg-green-700 text-base-100'>Running</div>
      break;
    case 503:
      statusElement = <div className='badge p-4 bg-accent'>Maintenance</div>
      break;
    default:
      statusElement = <div className='badge p-4 bg-red-700 text-base-100'>Not running</div>
  }

  return (
    <div className="flex flex-col justify-start items-start h-full">
      <div className='flex flex-row justify-between items-center w-full'>
        <h1 className='text-xl font-bold'>Home</h1>
        <div className='flex flex-row justify-end items-center'>
          <h1 className='text mr-2'>Server status:</h1>
          {statusElement}
        </div>
      </div>
      <h1 className='my-2'>Version History</h1>
      <div className='w-full bg-secondary bg-opacity-50 rounded-md p-2 h-full overflow-auto flex flex-col'>
        <div className='mb-4'>
          <span className='font-bold'>[0.5.0]</span> <br />
          <span className='whitespace-pre-wrap'>
            12-20-2024<br />
            - Added reamer tool type<br />
            - Added center detail view and dimensioning<br />
            - Added left-handed helixes<br />
            - Added ability to create tools from blanks (copy blank -&gt; select other tool type)<br />
            - Added web client titles and icon<br />
            - Added tool thumbnails<br />
            - Added ability to edit series parameters on new specification page<br />
            - Added option to create a specification without a series<br />
            - Fixed step dimensions not inserting<br />
            - Several bug fixes<br />
            - Several visual improvements
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.3.1]</span> <br />
          <span className='whitespace-pre-wrap'>
            11-29-2024<br />
            - Fixed Solidworks file staying opened preventing new specs from being created<br />
            - Added server status to homepage<br />
            - Updated framework version<br />
            - Added copy dialog on specification detail page click<br />
            - Added copy and delete function for all settings sections<br />
            - Added version deploy date to homepage<br />
            - Several visual improvements<br />
            - Several bug fixes
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.3.0]</span> <br />
          <span className='whitespace-pre-wrap'>
            11-13-2024<br />
            - Added blank tool type<br />
            - Added EM cooling<br />
            - Added centers<br />
            - Added new drawing dimension algorithm<br />
            - Added step tools<br />
            - Added catalog tools<br />
            - Added default values for new & catalog tools<br />
            - Added straight flute for drill<br />
            - Improved specification detail page<br />
            - Finished drill tool type<br />
            - Improved performance<br />
            - Several visual improvements<br />
            - Several bug fixes
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.2.0]</span> <br />
          <span className='whitespace-pre-wrap'>
            8-7-2024<br />
            - Added custom body length<br />
            - Added chipbreaker<br />
            - Added settings page<br />
            - Added specification searching<br />
            - Added forming view on drawing<br />
            - Added version history on homepage<br />
            - Added outdated version warning for old specifications<br />
            - Added drill tool type (not finished)<br />
            - Several bug fixes
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.1.0]</span> <br />
          <span className='whitespace-pre-wrap'>
            5-30-2024<br />
            - Initial release
          </span>
        </div>
      </div>
    </div>
  )
}
