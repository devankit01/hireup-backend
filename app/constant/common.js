const ORDER_KEYS = {
  ASC: "ASC",
  DESC: "DESC",
};

const LANGUAGE = {
  HI: "hi",
  EN: "en",
};

const FILTER_ID = {
  MINISTRY_ID: "ministry_id",
  SECTOR_ID: "sector_id",
  SCHEME_ID: "scheme_id",
};

const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const REGEX_PATTERN = {
  PHONE_REGEX: "^[6-9]{1}[0-9]{9}$",
};

const VIDEO_STATUS_CONDITION = {
  ACTIVE: [
    { is_active: true },
    { is_approved: "IS NULL" },
    { is_deleted: false },
  ],
  PENDING: [{ is_approved: "IS NULL" }, { is_deleted: false }],
  REJECTED: [{ is_approved: false }],
  DELETED: [{ is_deleted: true }],
};

const EMAIL_SUBJECTS = {
  SEND_OTP: "One Time Password",
};

const EMAIL_TEMPLATES = {
  RESET_PASSWORD: "sendOtpFeedback.ejs",
};

const PUBLIC_FOLDER = "/app/public/";

const NOTIFICATION_MESSAGE = {
  VIDEO_FOR_APPROVAL: "Video for approval",
  VIDEO_APPROVED: "Video approved",
  VIDEO_REJECTED: "Video rejected",
  VIDEO_DELETED: "Video deleted",
};

const BOOLEAN_VAL = {
  FALSE: false,
  TRUE: true,
};

const COMPANY_DOC = [
  { name: "pan", maxCount: 2 },
  { name: "aadhar", maxCount: 1 },
];
const REJECT_TYPE = {
  REASON_1: "Invalid License",
  REASON_2: "Invalid Email",
  REASON_3: "Invalid Phone",
  REASON_4: "Invalid Name",
  OTHER: "Others",
};

module.exports = {
  ORDER_KEYS,
  LANGUAGE,
  FILTER_ID,
  REGEX_PATTERN,
  STATUS,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  PUBLIC_FOLDER,
  VIDEO_STATUS_CONDITION,
  NOTIFICATION_MESSAGE,
  BOOLEAN_VAL,
  COMPANY_DOC,
  REJECT_TYPE,
};
