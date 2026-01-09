import Script from "next/script";

interface StructuredDataProps {
  type?: "home" | "property" | "experience" | "destination" | "faq" | "reviews" | "blog";
  data?: any;
}

export default function StructuredData({ type = "home", data }: StructuredDataProps) {
  // Organization Schema - appears on all pages
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Group Escape Houses",
    url: "https://groupescapehouses.co.uk",
    logo: "https://groupescapehouses.co.uk/logo.png",
    description: "Luxury hen party houses and group accommodation across the UK with hot tubs, pools, and games rooms. Perfect for celebrations, hen weekends, and special occasions.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11a North Street",
      addressLocality: "Brighton",
      addressRegion: "East Sussex",
      postalCode: "BN41 1DH",
      addressCountry: "GB"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-1273-569301",
      email: "hello@groupescapehouses.co.uk",
      contactType: "Customer Service",
      areaServed: "GB",
      availableLanguage: "English"
    },
    sameAs: [
      "https://instagram.com/groupescapehouses",
      "https://facebook.com/groupescapehouses",
      "https://twitter.com/groupescapehouses",
      "https://tiktok.com/@groupescapehouses",
      "https://youtube.com/@groupescapehouses",
      "https://pinterest.com/groupescapehouses"
    ]
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://groupescapehouses.co.uk",
    name: "Group Escape Houses",
    image: "https://groupescapehouses.co.uk/logo.png",
    priceRange: "££-£££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11a North Street",
      addressLocality: "Brighton",
      addressRegion: "East Sussex",
      postalCode: "BN41 1DH",
      addressCountry: "GB"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "50.8225",
      longitude: "-0.1372"
    },
    telephone: "+44-1273-569301",
    email: "hello@groupescapehouses.co.uk",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "3000",
      bestRating: "5",
      worstRating: "1"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Group Escape Houses",
    url: "https://groupescapehouses.co.uk",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://groupescapehouses.co.uk/properties?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // RentalAgency Schema - More specific for property rentals
  const rentalAgencySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Group Escape Houses",
    description: "Premium vacation rental agency specialising in luxury group accommodation, hen party houses, and celebration properties across the UK",
    url: "https://groupescapehouses.co.uk",
    telephone: "+44-1273-569301",
    email: "hello@groupescapehouses.co.uk",
    areaServed: [
      {
        "@type": "Country",
        name: "United Kingdom"
      }
    ],
    serviceType: ["Vacation Rental", "Group Accommodation", "Hen Party Houses", "Luxury Cottage Rental"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "3000",
      bestRating: "5"
    }
  };

  // Service Schema - Accommodation Services
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Luxury Group Accommodation Rental",
    provider: {
      "@type": "Organization",
      name: "Group Escape Houses"
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Group Accommodation Properties",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Hen Party Houses",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Luxury Hen Party House with Hot Tub",
                description: "Premium group accommodation for 8-30 guests with hot tubs, games rooms, and party facilities"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          name: "Large Holiday Homes",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Large Group Holiday Home",
                description: "Spacious properties for family reunions and group celebrations"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          name: "Party Experiences",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Cocktail Masterclass",
                description: "Professional cocktail making classes for groups of 8-20"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Private Chef Experience",
                description: "Professional private chef services for group dining"
              }
            }
          ]
        }
      ]
    }
  };

  // BreadcrumbList Schema - Important for navigation
  const breadcrumbSchema = type === "home" ? null : {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://groupescapehouses.co.uk"
      },
      ...(type === "property" ? [
        {
          "@type": "ListItem",
          position: 2,
          name: "Properties",
          item: "https://groupescapehouses.co.uk/properties"
        },
        ...(data?.propertyName ? [{
          "@type": "ListItem",
          position: 3,
          name: data.propertyName,
          item: `https://groupescapehouses.co.uk/properties/${data.slug}`
        }] : [])
      ] : []),
      ...(type === "experience" ? [
        {
          "@type": "ListItem",
          position: 2,
          name: "Experiences",
          item: "https://groupescapehouses.co.uk/experiences"
        },
        ...(data?.experienceName ? [{
          "@type": "ListItem",
          position: 3,
          name: data.experienceName,
          item: `https://groupescapehouses.co.uk/experiences/${data.slug}`
        }] : [])
      ] : []),
      ...(type === "destination" ? [
        {
          "@type": "ListItem",
          position: 2,
          name: "Destinations",
          item: "https://groupescapehouses.co.uk/destinations"
        },
        ...(data?.destinationName ? [{
          "@type": "ListItem",
          position: 3,
          name: data.destinationName,
          item: `https://groupescapehouses.co.uk/destinations/${data.slug}`
        }] : [])
      ] : [])
    ]
  };

  // HowTo Schema - Booking Process
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Book a Hen Party House with Group Escape Houses",
    description: "Simple 4-step process to book your perfect luxury group accommodation in the UK",
    totalTime: "PT15M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose Your House",
        text: "Browse our luxury properties and find your perfect match for your celebration or group gathering. Filter by location, group size, and features like hot tubs and games rooms.",
        url: "https://groupescapehouses.co.uk/properties"
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add Experiences",
        text: "Select from cocktail classes, butlers, spa treatments and more to enhance your weekend. Customize your stay with professional party planning services.",
        url: "https://groupescapehouses.co.uk/experiences"
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Pay Deposit",
        text: "Secure your booking with a simple deposit payment via our safe payment system. We accept all major cards and process payments securely through Stripe.",
        url: "https://groupescapehouses.co.uk/contact"
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Pay Final Balance",
        text: "Pay the remaining balance 6-8 weeks before your stay and enjoy your unforgettable celebration! We'll send you all property details and check-in instructions.",
        url: "https://groupescapehouses.co.uk/how-it-works"
      }
    ]
  };

  // VideoObject Schema - For hero video
  const videoSchema = type === "home" ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Group Escape Houses - Luxury Party Houses UK",
    description: "Explore our stunning luxury group accommodation across the UK, featuring hot tubs, swimming pools, games rooms, and more.",
    thumbnailUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg",
    contentUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-drone-shot-slowly-appro-759de154-20251022202429.mp4",
    uploadDate: "2024-10-22",
    duration: "PT8S"
  } : null;

  // ItemList Schema - For property listings
  const itemListSchema = type === "home" ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Luxury Party Houses UK",
    numberOfItems: 3,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          "@id": "https://groupescapehouses.co.uk/properties/brighton-manor",
          name: "The Brighton Manor",
          description: "Luxury hen party house in Brighton sleeping 16 guests with hot tub and swimming pool",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "GBP",
            lowPrice: "89",
            highPrice: "150",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "89",
              priceCurrency: "GBP",
              unitText: "per person per night"
            }
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "120"
          }
        }
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          "@id": "https://groupescapehouses.co.uk/properties/bath-spa-retreat",
          name: "Bath Spa Retreat",
          description: "Luxury group accommodation in Bath sleeping 20 guests with games room and cinema",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpg",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "GBP",
            lowPrice: "95",
            highPrice: "180",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "95",
              priceCurrency: "GBP",
              unitText: "per person per night"
            }
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "98"
          }
        }
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          "@id": "https://groupescapehouses.co.uk/properties/manchester-party-house",
          name: "Manchester Party House",
          description: "Premier hen party house in Manchester sleeping 14 with hot tub and BBQ area",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-303caf30-20251018131730.jpg",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "GBP",
            lowPrice: "79",
            highPrice: "140",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "79",
              priceCurrency: "GBP",
              unitText: "per person per night"
            }
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "87"
          }
        }
      }
    ]
  } : null;

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I book a hen party house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Browse our properties, select your preferred house, and submit an enquiry with your dates and group size. Our UK team will respond within 24 hours with availability and a quote. You can also call us for instant assistance."
        }
      },
      {
        "@type": "Question",
        name: "What is included in the price?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All our properties include utilities, Wi-Fi, and standard amenities. Most houses feature hot tubs, games rooms, and entertainment facilities. Additional experiences like cocktail classes, butlers, and private chefs can be added to your booking."
        }
      },
      {
        "@type": "Question",
        name: "What is the deposit and payment schedule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We require a deposit to secure your booking (typically 25-30%). The remaining balance is due 6-8 weeks before your stay. All payments are processed securely via Stripe."
        }
      },
      {
        "@type": "Question",
        name: "Can I cancel or change my booking?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cancellation policies vary by property. Most bookings are non-refundable within 8 weeks of arrival. We recommend booking travel insurance. Contact our team to discuss any changes to your reservation."
        }
      },
      {
        "@type": "Question",
        name: "How many people can stay in a house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our houses accommodate groups from 8 to 30+ guests. Each property listing shows the maximum capacity, number of bedrooms, and bed configurations. Check the property details for exact sleeping arrangements."
        }
      },
      {
        "@type": "Question",
        name: "Are hen party houses suitable for other celebrations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! While we specialise in hen weekends, our properties are perfect for birthdays, anniversaries, family reunions, and any group celebration. Browse our experiences to find activities for your occasion."
        }
      },
      {
        "@type": "Question",
        name: "What about house rules and damage deposits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each property has specific house rules regarding noise, parties, and check-in times. A refundable damage deposit (typically £250-500) is required. Read our full terms and conditions for complete details."
        }
      },
      {
        "@type": "Question",
        name: "Can you arrange activities and experiences?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer cocktail masterclasses, butlers in the buff, life drawing, private chefs, spa treatments, and more. View our experiences page to see all available add-ons and pricing."
        }
      }
    ]
  };

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* LocalBusiness Schema */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* RentalAgency Schema - Specific for property rental business */}
      <Script
        id="rental-agency-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rentalAgencySchema) }}
      />

      {/* Service Schema with OfferCatalog */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* BreadcrumbList Schema */}
      {breadcrumbSchema && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* HowTo Schema - Booking process */}
      {type === "home" && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* VideoObject Schema */}
      {videoSchema && (
        <Script
          id="video-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}

      {/* ItemList Schema - Featured properties */}
      {itemListSchema && (
        <Script
          id="itemlist-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/* FAQ Schema - only on pages with FAQs */}
      {(type === "home" || type === "faq") && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}