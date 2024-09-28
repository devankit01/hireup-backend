exports.studentSignUpMapper = (data) => {
  return {
    id: data.id,
    email_verified: data.email_verified,
    status: data.status,
    name: data.name,
    rollNumber: data.roll_number,
    contact_number: data.contact_number,
    email: data.email,
    name: data.name,
    token: data.token,
  };
};

exports.collegeSignUpMapper = (data) => {
  return {
    id: data.id,
    email_verified: data.email_verified,
    status: data.status,
    contact_number: data.contact_number,
    college_name: data.college_name,
    email: data.email,
    name: data.name,
    token: data.token,
  };
};

exports.companySignUpMapper = (data) => {
  return {
    id: data.id,
    email_verified: data.email_verified,
    status: data.status,
    contact_number: data.contact_number,
    company_name: data.company_name,
    email: data.email,
    name: data.name,
    token: data.token,
  };
};

exports.recruiterSignUpMapper = (data) => {
  return {
    id: data.id,
    email_verified: data.email_verified,
    status: data.status,
    contact_number: data.contact_number,
    name: data.name,
    email: data.email,
    role: data.role,
    user_name: data.user_name,
    token: data.token,
  };
};
