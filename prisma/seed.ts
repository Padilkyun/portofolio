import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@portfolio.local";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: "Fadhi AIoT",
        title: "Professional AIoT Engineer",
        tagline:
          "Designing edge intelligence, reliable IoT pipelines, and field‑ready embedded systems.",
        bio: "Focused on AIoT systems that bridge sensors, edge compute, and actionable insights — from hackathon prototypes to production‑ready field deployments.",
        email: "hello@aiot.engineer",
        location: "Indonesia",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        photoUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      },
    });
  }

  // Experience & Bootcamp IDs for linking
  const pertaminaExp = await prisma.experience.upsert({
    where: { id: "pertamina-exp" },
    update: {},
    create: {
      id: "pertamina-exp",
      company: "Edge Computing Pertamina",
      role: "AIoT Engineer",
      location: "Indonesia",
      startDate: new Date("2024-06-01"),
      isCurrent: true,
      description: "Built edge inference pipelines for industrial sensing, optimized latency on constrained devices.",
    },
  });

  const dbsBootcamp = await prisma.bootcamp.upsert({
    where: { id: "dbs-bootcamp" },
    update: {},
    create: {
      id: "dbs-bootcamp",
      name: "DBS Coding Camp",
      organizer: "DBS Foundation",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-01"),
      description: "Full-stack engineering program with strong focus on product delivery and clean architecture.",
      skills: JSON.stringify(["JavaScript", "Web", "Product Thinking"]),
    },
  });

  // Skills
  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "TinyML / Edge AI", category: "AI", level: 5 },
        { name: "Computer Vision", category: "AI", level: 4 },
        { name: "ESP32 / Arduino", category: "IoT", level: 5 },
        { name: "MQTT / LoRa", category: "IoT", level: 4 },
        { name: "Next.js / Node", category: "Cloud", level: 4 },
        { name: "Python / Pandas", category: "Data", level: 5 },
      ],
    });
  }

  // Clear existing projects to avoid slug conflicts during full re-seed
  await prisma.project.deleteMany({});

  const projects = [
    {
      slug: "early-bullying-detection-iot",
      title: "Early Bullying Detection Embedded System",
      summary: "Edge‑based multi‑sensor system that detects early signs of bullying events and alerts caregivers.",
      description: "An AIoT safety system combining wearable sensing, on‑device classification, and a monitoring dashboard. Privacy-focused by design.",
      category: "IoT",
      year: 2024,
      featured: true,
      techSolutions: JSON.stringify([
        { title: "On‑device TinyML (CNN)", description: "100KB TFLite Micro model running on ESP32 at ~25ms inference for acoustic event classification." },
        { title: "Bayesian Multi-modal Fusion", description: "Algorithm combining heartbeat anomaly scores (Pulse sensor) and vocal stress markers to minimize false positives." }
      ])
    },
    {
      slug: "edge-computing-pertamina",
      title: "Edge Computing for Industrial Sensing (PHR)",
      summary: "Industrial edge stack for low‑latency sensor analytics at Pertamina Hulu Rokan.",
      description: "Deployed edge compute nodes (Jetson Nano) near industrial sensors to run filtering, anomaly detection, and local buffering.",
      category: "IoT",
      year: 2025,
      featured: true,
      techSolutions: JSON.stringify([
        { title: "Containerised LSTM Anomaly Detector", description: "Dockerised micro-services executing real-time anomaly detection on pressure/vibration streams." },
        { title: "Swagger-Interoperable Middleware", description: "Rust-based bridge ensuring interoperability between local Edge nodes and legacy SCADA Swagger APIs." }
      ])
    },
    {
      slug: "mosquify-gemastik-smartcity",
      title: "Mosquify — IoT GIS for Endemic Prediction",
      summary: "Smart City solution for spatial mapping and early detection of DBD risk.",
      description: "Integrated IoT network (turbidity, TDS, pH, weather) combined with ML classification to predict mosquito breeding potential.",
      category: "IoT",
      year: 2024,
      featured: true,
      techSolutions: JSON.stringify([
        { title: "Environmental Risk Classification", description: "Scikit-learn model using water quality and weather features to categorize risk levels (Aman/Waspada/Bahaya)." },
        { title: "Real-time Telemetry Pipeline", description: "Firebase-driven architecture with 3-second ingestion latency across multiple node clusters." }
      ])
    },
    {
      slug: "pickme-garuda-factchecker",
      title: "PICKME GARUDA — Collaborative Fact-Checker",
      summary: "Next.js & Flutter platform for collaborative news verification and literacy.",
      description: "Award-winning platform (1st Place Hackathon PNP) connecting citizens and government for news validation.",
      category: "AI",
      year: 2024,
      featured: true,
      techSolutions: JSON.stringify([
        { title: "NLP Spam & Bot Detection", description: "Transformer-based model to filter automated misinformation and low-quality submissions." },
        { title: "Real-time Verification Dashboard", description: "Next.js dashboard for government verifiers with WebSocket notifications for reporters." }
      ])
    },
    {
      slug: "smart-waste-tracking-routing",
      title: "Smart Waste Tracking & Routing",
      summary: "Dynamic routing and capacity monitoring for urban waste management.",
      description: "Computer vision and ultrasonic sensing to monitor TPS capacity and optimize truck collection routes.",
      category: "IoT",
      year: 2024,
      techSolutions: JSON.stringify([
        { title: "VRP (Vehicle Routing Problem) Optimizer", description: "Genetic algorithm-based router that calculates optimal paths for waste trucks based on real-time bin levels." },
        { title: "Trash Type Recognition", description: "MobileNet-v2 edge model classifying waste (Organic/Inorganic/B3) with >85% accuracy." }
      ])
    },
    {
      slug: "capsibox-smart-storage",
      title: "Capsibox — Smart Cold-Chain Box",
      summary: "IoT-enabled smart box for secure and temperature-tracked distribution.",
      description: "Active temperature control and telemetry for high-value agricultural commodities like chili.",
      category: "IoT",
      year: 2023,
      techSolutions: JSON.stringify([
        { title: "PID Temperature Control", description: "Custom ESP32 firmware using PID logic to drive Peltier cooling/heating elements for <0.5°C stability." },
        { title: "BLE Proximity Sync", description: "Flutter app synchronizing trip logs (temperature/time) via Bluetooth Low Energy for audit trails." }
      ])
    },
    {
      slug: "sign-language-translator-dl",
      title: "Real-time Sign Language Translator",
      summary: "Deep Learning based hand posture recognition for inclusive communication.",
      description: "MediaPipe and LSTM based system translating Indonesian Sign Language (SIBI) into text/speech.",
      category: "AI",
      year: 2023,
      techSolutions: JSON.stringify([
        { title: "MediaPipe Landmark Extraction", description: "Real-time extraction of 21 hand landmarks to reduce model input dimensionality and improve robustness." },
        { title: "Temporal LSTM Classification", description: "Sequence-based model to recognize dynamic gestures with high temporal sensitivity." }
      ])
    },
    {
      slug: "vr-public-speaking-biometric",
      title: "VR Public Speaking with Biometric Feedback",
      summary: "Immersive VR practice with real-time stress monitoring via GSR and Pulse.",
      description: "A Final Project integrating VR environments with wearable biometric sensors for objective performance analysis.",
      category: "AI",
      year: 2025,
      featured: true,
      techSolutions: JSON.stringify([
        { title: "Biometric Stress Analysis", description: "Signal processing pipeline (Python) mapping Pulse and GSR (Galvanic Skin Response) spikes to VR events." },
        { title: "STT Transcription (Whisper)", description: "Integration of Faster-Whisper CT2 for instant speech analysis and filler-word detection." }
      ])
    },
    {
      slug: "air-quality-eda-dashboard",
      title: "Air Quality Analysis & EDA Dashboard",
      summary: "Comprehensive EDA and interactive dashboard for multi-station AQI data.",
      description: "Processing 420k+ rows of environmental data to produce actionable urban quality insights.",
      category: "Data Science",
      year: 2024,
      techSolutions: JSON.stringify([
        { title: "RFM-based Station Ranking", description: "Novel adaptation of Recency-Frequency-Monetary analysis to rank air pollution severity across stations." },
        { title: "Statistical Cleaning Pipeline", description: "Automated outlier detection and interpolation for multi-variable environmental time-series." }
      ])
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({
      data: {
        ...proj,
        status: "published",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
      }
    });
  }

  console.log("Seed complete. All projects added and linked to experience/bootcamp contexts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
