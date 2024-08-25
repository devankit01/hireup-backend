const Joi = require("joi");
const { ORDER_KEYS } = require("../constant/common");
const {
  DEFAULT_VALUE_LIST,
  PASSWORD,
  allowedDomains,
  ID,
} = require("../constant/auth");

const search = Joi.string().trim().optional();
const page = Joi.number().min(DEFAULT_VALUE_LIST.MIN);
const size = Joi.number().min(DEFAULT_VALUE_LIST.MIN);

const sort = Joi.string().trim().default(DEFAULT_VALUE_LIST.SORT);
const sortOrder = Joi.string()
  .trim()
  .valid(ORDER_KEYS.ASC, ORDER_KEYS.DESC)
  .default(ORDER_KEYS.DESC);

const numberId = Joi.number().min(1).optional();
const numberIdRequired = Joi.number().min(1).required();

// for uuid format
const requiredId = Joi.string().required().guid({ version: ID.VERSION });
const optionalId = Joi.string().guid({ version: ID.VERSION });
const password = Joi.string()
  .regex(PASSWORD.REGEXP)
  .message(PASSWORD.MSG)
  .min(PASSWORD.MINCHAR)
  .max(PASSWORD.MAXCHAR)
  .required();

const list = Joi.object({
  search,
  page,
  size,
  sort,
  sortOrder,
});

const listObject = {
  search,
  page,
  size,
  sort,
  sortOrder,
};

const email = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: allowedDomains } })
  .trim()
  .lowercase()
  .required();

const updateProfile = Joi.object({
  name: Joi.string().trim().min(3).max(500),
}).min(1);

module.exports = {
  search,
  page,
  size,
  sort,
  sortOrder,
  list,
  listObject,
  requiredId,
  optionalId,
  password,
  email,
  numberId,
  numberIdRequired,
  updateProfile,
};
