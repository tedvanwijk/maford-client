import { Version } from './types';

export default async function Home() {
  const status = await fetch(
    `${process.env.API_URL}/status`,
    {
      method: "GET",
      cache: "no-cache"
    }
  ).then(res => res.status);

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

  const versions = await fetch(
    `${process.env.API_URL}/versions`,
    {
      method: "GET",
      cache: "no-cache"
    }
  ).then(res => res.json());
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
        {
          versions.map((e: Version) => (
            <div className='mb-4' key={e.version_id}>
              <span className='font-bold'>[{e.version_number}]</span> <br />
              <span className='whitespace-pre-wrap'>{e.changelog}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
