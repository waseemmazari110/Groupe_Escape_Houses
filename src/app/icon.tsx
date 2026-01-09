import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/jpeg';

export default async function Icon() {
    // Use the header logo for the favicon
    const logoUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg';
  
  try {
    const response = await fetch(logoUrl);
    const imageBuffer = await response.arrayBuffer();
    
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
  } catch (error) {
    // Fallback to a simple colored square if image fetch fails
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F3F0',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#C6A76D',
              fontFamily: 'Georgia, serif',
            }}
          >
            GE
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}