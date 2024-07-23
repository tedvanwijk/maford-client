import Image from 'next/image'
import { Version } from './types';

export default async function Home() {
  const versions = await fetch(
    `${process.env.API_URL}/versions`,
    {
        method: "GET",
        cache: "no-cache"
    }
).then(res => res.json());
  return (
    <div className="flex flex-col justify-start items-start h-full">
      <h1 className='text-xl font-bold'>Home</h1>
      <h1 className='my-2'>Version History</h1>
      <div className='w-full bg-secondary bg-opacity-50 rounded-md p-2 h-full overflow-auto flex flex-col'>
        {
          versions.map((e: Version) => (
            <div className='mb-4'>
              <span className='font-bold'>[{e.version_number}]</span> <br />
              <span className='whitespace-pre-wrap'>{e.changelog}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
