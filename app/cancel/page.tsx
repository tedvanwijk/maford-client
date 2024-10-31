import { redirect, RedirectType } from 'next/navigation'

export default async function Cancel(
    { searchParams }:
        { searchParams: { r: string} }
) {
    await fetch(
        `${process.env.API_URL}/specifications/cancel/${searchParams.r}`,
        {
            method: "PUT",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => redirect(`/specifications/details?r=${searchParams.r}`, RedirectType.replace));
    return (
        <></>
    )
}