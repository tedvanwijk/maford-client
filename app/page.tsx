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
        <div className="mb-4">
          <span className='font-bold'>[0.5.4]</span> <br />
          <span className="whitespace-pre-wrap">
            6-9-2025<br />
            - Added Moeller Manufacturing drawing format<br />
            - Update manufacturing and approval drawing formats<br />
            - Fixed non-step straight flute drills specs failing<br />
            - Fixed custom drawing types not exporting<br />
            - Fixed washout running into shank for small diameter tools<br />
            - Updated Solidworks version to 2024 SP3.1<br />
            - Automatically go to &apos;All specifications&apos; when searching specifications<br />
            - Small visual changes
          </span>
        </div>
        <div className="mb-4">
          <span className='font-bold'>[0.5.3]</span> <br />
          <span className="whitespace-pre-wrap">
            6-1-2025<br />
            - Fixed inputs changing values if user scrolls page while cursor is on input<br />
            - Added error description for failed step features
          </span>
        </div>
        <div className="mb-4">
          <span className='font-bold'>[0.5.2]</span> <br />
          <span className="whitespace-pre-wrap">
            5-29-2025<br />
            - Fixed input copying causing error when submitting specs with blank enabled inputs<br />
            - Fixed &apos;To tangency&apos; step toggle not disabling correctly
          </span>
        </div>
        <div className="mb-4">
          <span className='font-bold'>[0.5.1]</span> <br />
          <span className="whitespace-pre-wrap">
            5-24-2025<br />
            - Fixed incorrect controller version causing spec errors<br />
            - Fixed &apos;go to error&apos; not working for fluting section
          </span>
        </div>
        <div className="mb-4">
          <span className='font-bold'>[0.5.0]</span> <br />
          <span className="whitespace-pre-wrap">
            5-20-2025<br />
            - Added form validation<br />
            - Added min and max values for form inputs<br />
            - Added part and drawing file types to form<br />
            - Added custom drawing type for user-created sheet formats<br />
            - Added tolerance table on drawing toggle for custom drawing type<br />
            - Added user admin check when loading settings page<br />
            - Added loading screens<br />
            - Added steps for all tool types<br />
            - Added rule property iteration for dimensioning sheet<br />
            - Added support for tolerances insertion in dimension and table simultaneously (NOTE: the tolerance sheets for existing series need to be changed)<br />
            - Added incomplete shank to head radius<br />
            - Added option of only setting 1 radius for steps<br />
            - Added step length from point toggle<br />
            - Added step length to countersink tangency toggle<br />
            - Added structure for documentation<br />
            - Added 3-fluted drills<br />
            - Added coolant for straight fluted drills<br />
            - Added front, middle and rear margin options for drills<br />
            - Added front, middle and rear margin options for straight fluted step drills<br />
            - Removed type selection from step form<br />
            - Removed settings button from navbar<br />
            - Fixed solidworks error for coolant with count = 1<br />
            - Fixed part number not setting in form for copied catalog tools<br />
            - Fixed spec table wrongly inserting for approval drawings<br />
            - Fixed series copying not working if old inactive series has identical name<br />
            - Fixed incorrect shank type in some situations<br />
            - Fixed flute washout running into shank for blend and neck shank tools with small tool diameters<br />
            - Fixed drill margins width not updating<br />
            - Updated NextJS version<br />
            - Several bug fixes<br />
            - Several visual improvements
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.4.1]</span> <br />
          <span className='whitespace-pre-wrap'>
            12-28-2024<br />
            - Added corner radius and ballnose options for reamer<br />
            - Added option to choose between approval or manufacturing drawing types<br />
            - Added button to reset fluting parameters when manually changed on form<br />
            - Improved reamer washout for helical fluting<br />
            - Improved tool type specific coolant lateral location in fluting<br />
            - Changed output file names<br />
            - Fixed issue where coolant laterals where on wrong side of tool in some cases<br />
            - Fixed client error for missing thumbnails<br />
            - Fixed missing arrows on dropdown inputs<br />
            - Fixed fluting not generating for small diameter tools in some cases<br />
            - Small specification form changes
          </span>
        </div>
        <div className='mb-4'>
          <span className='font-bold'>[0.4.0]</span> <br />
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
            - Added spec creation date to table<br />
            - Removed settings link for non-admin accounts<br />
            - Modified series to deletion to instead deactivate so older specs show correctly<br />
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
