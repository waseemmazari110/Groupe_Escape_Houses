import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import OpenAI from "openai";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Lazy initialize Twilio client only when needed
function getTwilioClient() {
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }
  return twilio(accountSid, authToken);
}

// Lazy initialize OpenAI client only when needed
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null; // Return null if not configured, we'll handle gracefully
  }
  return new OpenAI({ apiKey });
}

// Website context for the AI chatbot
const WEBSITE_CONTEXT = `
You are a helpful assistant for Group Escape Houses, a luxury hen party house rental company in the UK.

COMPANY INFO:
- Office: 11a North St, Brighton and Hove, Brighton BN41 1DH
- Email: hello@thehenfairy.co.uk
- Website: groupescapehouses.co.uk

SERVICES:
We offer luxury group accommodation across the UK perfect for hen weekends, birthdays, and special celebrations.

KEY FEATURES:
- Properties with hot tubs, pools, games rooms, spas
- Sleeps 10-30+ guests
- Weekend and midweek pricing available
- Instant enquiry and transparent pricing

POPULAR DESTINATIONS:
- Brighton (The Brighton Manor, Brighton Seafront Villa)
- Bath (The Royal Crescent Manor, Bath Spa Townhouse)
- Manchester (Manchester Party House)
- Bournemouth (Bournemouth Beach House)
- Newcastle (The Quayside Residence)

EXPERIENCES AVAILABLE:
1. Cocktail Masterclass (2 hours, from £45pp)
2. Butlers in the Buff (from £150)
3. Life Drawing (1.5-2 hours, from £35pp)
4. Private Chef (from £50pp)
5. Spa Treatments (various prices)
6. Bottomless Brunch (from £40pp)

PRICING:
- Weekend rates from £79-£120 per person per night
- Midweek rates from £59-£95 per person per night
- 25% deposit required to secure booking
- Balance due 6 weeks before arrival
- £500 refundable damage deposit

BOOKING PROCESS:
1. Browse properties and choose your house
2. Select dates and add experiences
3. Pay 25% deposit to secure
4. Pay final balance 6 weeks before
5. Enjoy your celebration!

HOUSE RULES:
- Check-in: 4pm
- Check-out: 10am
- No smoking inside
- Quiet hours: 11pm - 8am
- Damage deposit required

Always be friendly, helpful, and encourage users to make an enquiry via our website or call/email us directly.
If asked about specific availability, direct them to our instant enquiry form on the website.
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;

    if (!body) {
      return new NextResponse("No message body", { status: 400 });
    }

    let aiResponse = "Thanks for your message! For immediate assistance, please email us at hello@thehenfairy.co.uk or visit our website at groupescapehouses.co.uk to make an instant enquiry.";

    // Try to generate AI response if OpenAI is configured
    const openai = getOpenAIClient();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: WEBSITE_CONTEXT,
            },
            {
              role: "user",
              content: body,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        aiResponse = completion.choices[0].message.content || aiResponse;
      } catch (error) {
        console.error("OpenAI error:", error);
        // Fall back to default message
      }
    }

    // Send response via Twilio
    const twilioClient = getTwilioClient();
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(
      "Sorry, I'm having trouble right now. Please email us at hello@thehenfairy.co.uk or call our office."
    );

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

// Twilio webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "WhatsApp webhook active" });
}