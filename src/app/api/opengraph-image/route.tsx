import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getNeynarUser } from "~/lib/neynar";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  const user = fid ? await getNeynarUser(Number(fid)) : null;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col justify-center items-center relative bg-purple-600">
        {user?.pfp_url && (
          <div tw="flex w-96 h-96 rounded-full overflow-hidden mb-8 border-8 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="App Icon"
          width={80}
          height={80}
          style={{ borderRadius: '50%' }}
        />
          </div>
        )}
        <h1 tw="text-8xl text-white">{user?.display_name ? `Hello from ${user.display_name ?? user.username}!` : 'Hello!'}</h1>
        <p tw="text-5xl mt-4 text-white opacity-80">Powered by Neynar 🪐</p>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}