const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DATA_DIR = path.join(__dirname, "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── MongoDB Schema ──
const registrationSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    participantName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },

    // Emergency Contact
    emergencyContact: {
      name: { type: String, default: "" },
      relation: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    // Participation Mode
    participationType: { type: String, enum: ["solo", "team"], default: "solo" },
    teamName: { type: String, default: "" },
    teamMembers: [
      {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
      },
    ],

    // Track & Abstract
    track: { type: String, required: true },
    projectAbstract: { type: String, default: "" },

    // Mandatory Hackathon Protocols
    foodPreference: {
      type: String,
      enum: ["Pure Vegetarian", "Jain Food", "Swaminarayan Food", "Standard / Non-Veg"],
      default: "Pure Vegetarian",
    },
    securityAgreed: { type: Boolean, default: true },
    parentalApproval: {
      parentName: { type: String, default: "" },
      parentPhone: { type: String, default: "" },
      relationship: { type: String, default: "" },
      agreed: { type: Boolean, default: true },
    },

    // RSVP & Boarding Status
    status: {
      type: String,
      enum: ["Registered", "Shortlisted", "Confirmed_RSVP", "Checked_In"],
      default: "Registered",
    },
    rsvpToken: { type: String, default: "" },
    rsvpCompleted: { type: Boolean, default: false },
    rsvpConfirmedAt: { type: Date },
    laptopSerial: { type: String, default: "" },
    boothNumber: { type: String, default: "Booth #A-12" },

    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

let RegistrationModel = null;
let isMongoConnected = false;

async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim().startsWith("mongodb")) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isMongoConnected = true;
      RegistrationModel = mongoose.model("Registration", registrationSchema);
      console.log("🍃 Successfully connected to MongoDB Atlas!");
      return;
    } catch (err) {
      console.warn("⚠️  MongoDB Atlas connection failed. Falling back to local data store:", err.message);
    }
  } else {
    console.log("ℹ️  No MONGODB_URI configured in .env. Running on local persistent file store (data/registrations.json).");
  }

  isMongoConnected = false;
  // Local Mongoose model stub for type safety
  try {
    RegistrationModel = mongoose.model("Registration", registrationSchema);
  } catch (e) {
    RegistrationModel = mongoose.models.Registration;
  }
}

// ── Fallback Local JSON Storage Handlers ──
function getLocalRegistrations() {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, "utf-8") || "[]");
    }
  } catch (e) {
    console.error("[db] Local storage read error:", e.message);
  }
  return [];
}

function saveLocalRegistrations(list) {
  try {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("[db] Local storage write error:", e.message);
  }
}

// ── Unified Data Access Interface ──
async function saveRegistration(record) {
  if (isMongoConnected && RegistrationModel) {
    try {
      const doc = new RegistrationModel(record);
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error("[db] MongoDB save error, falling back to local file:", err.message);
    }
  }

  const list = getLocalRegistrations();
  const existingIndex = list.findIndex((r) => r.registrationId === record.registrationId || r.email === record.email);
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...record };
  } else {
    list.push(record);
  }
  saveLocalRegistrations(list);
  return record;
}

async function findRegistrationByIdOrEmail(query) {
  if (!query) return null;
  const qClean = query.trim().toLowerCase();

  if (isMongoConnected && RegistrationModel) {
    try {
      const found = await RegistrationModel.findOne({
        $or: [
          { registrationId: new RegExp(`^${query.trim()}$`, "i") },
          { email: qClean },
          { rsvpToken: query.trim() },
        ],
      });
      if (found) return found.toObject();
    } catch (err) {
      console.error("[db] MongoDB find error:", err.message);
    }
  }

  const list = getLocalRegistrations();
  return (
    list.find(
      (r) =>
        (r.registrationId && r.registrationId.toLowerCase() === qClean) ||
        (r.email && r.email.toLowerCase() === qClean) ||
        (r.rsvpToken && r.rsvpToken === query.trim())
    ) || null
  );
}

async function updateRegistration(registrationId, updates) {
  if (isMongoConnected && RegistrationModel) {
    try {
      const updated = await RegistrationModel.findOneAndUpdate(
        { registrationId },
        { $set: updates },
        { new: true }
      );
      if (updated) return updated.toObject();
    } catch (err) {
      console.error("[db] MongoDB update error:", err.message);
    }
  }

  const list = getLocalRegistrations();
  const idx = list.findIndex((r) => r.registrationId === registrationId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalRegistrations(list);
    return list[idx];
  }
  return null;
}

module.exports = {
  initDatabase,
  saveRegistration,
  findRegistrationByIdOrEmail,
  updateRegistration,
  isMongoConnected: () => isMongoConnected,
};
