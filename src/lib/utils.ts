import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APP_BUTTON_TEXT, APP_DESCRIPTION, APP_ICON_URL, APP_NAME, APP_OG_IMAGE_URL, APP_PRIMARY_CATEGORY, APP_SPLASH_BACKGROUND_COLOR, APP_TAGS, APP_URL, APP_WEBHOOK_URL } from './constants';
import { APP_SPLASH_URL } from './constants';

interface FrameMetadata {
  version: string;
  name: string;
  iconUrl: string;
  homeUrl: string;
  imageUrl?: string;
  buttonTitle?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
  webhookUrl?: string;
  description?: string;
  primaryCategory?: string;
  tags?: string[];
};

interface FrameManifest {
  accountAssociation?: {
    header: string;
    payload: string;
    signature: string;
  };
  frame: FrameMetadata;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFrameEmbedMetadata(ogImageUrl?: string) {
  return {
    version: "next",
    imageUrl: ogImageUrl ?? APP_OG_IMAGE_URL,
    button: {
      title: APP_BUTTON_TEXT,
      action: {
        type: "launch_frame",
        name: APP_NAME,
        url: APP_URL,
        splashImageUrl: APP_SPLASH_URL,
        iconUrl: APP_ICON_URL,
        splashBackgroundColor: APP_SPLASH_BACKGROUND_COLOR,
        description: APP_DESCRIPTION,
        primaryCategory: APP_PRIMARY_CATEGORY,
        tags: APP_TAGS,
      },
    },
  };
}

export async function getFarcasterMetadata(): Promise<FrameManifest> {
  if (!APP_URL) {
    throw new Error('NEXT_PUBLIC_URL not configured');
  }

  // Get the domain from the URL (without https:// prefix)
  const domain = new URL(APP_URL).hostname;
  console.log('Using domain for manifest:', domain);

  return {
    accountAssociation: {
      header: process.env.ACCOUNT_ASSOCIATION_HEADER!,
      payload: process.env.ACCOUNT_ASSOCIATION_PAYLOAD!,
      signature: process.env.ACCOUNT_ASSOCIATION_SIGNATURE!,
    },
    frame: {
      name: "mini",
      version: "1",
      iconUrl: "https://mini.superuserz.com/icon.png",
      homeUrl: "https://mini.superuserz.com",
      imageUrl: "https://mini.superuserz.com/image.png",
      buttonTitle: "mini",
      splashImageUrl: "https://mini.superuserz.com/splash.png",
      splashBackgroundColor: "#000000",
      webhookUrl: "https://mini.superuserz.com/api/webhook",
      // subtitle: "mini",
      description: "mini",
      primaryCategory: "social",
      // tagline: "social",
      // ogTitle: "mini",
      // ogDescription: "mini",
      // castShareUrl: "https://warpcast.com/~/checkout+mini",
      // ogImageUrl: "https://media.licdn.com/dms/image/v2/D5603AQFIAb2dK8W7xQ/profile-displayphoto-shrink_400_400/B56ZUI9KtTHsAk-/0/1739612008219?e=1762387200&v=beta&t=Mf5BDkRqCXL6Cw6_pOaDtmrVj_Lr5SSfaOh-BIU5goE",
    },
  };
}
