import * as Yup from 'yup';

export const LoginSchema = Yup.object({

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),


});



export const LoginCodeSchema = Yup.object({
  code: Yup.string()
  .required('OTP Code is required'),
  // code: Yup.array()
  //   .of(
  //     Yup.string()
  //       .required('Each code field is required')
  //       .length(1, 'Each code must be exactly 1 character')
  //   )
  //   .length(6, 'Code must contain exactly 6 characters')
  //   .required('Code is required')

});

export const ManageSchema = Yup.object({

  firstName: Yup.string()
    .required('First Name is required'),
    middleName: Yup.string()
    .required('Middle Name is required'),
  lastName: Yup.string()
    .required('Last Name is required'),
  city: Yup.string()
    .required('City is required'),
  country: Yup.string()
    .required('Country is required'),
  zip: Yup.string()
    .required('Zip is required'),
  language: Yup.string()
    .required('Language is required'),
  profile: Yup.string()
    .required('Profile is required'),


});
export const TributeSchema = Yup.object({

  title: Yup.string()
    .required('Title is required'),
    firstName: Yup.string()
    .required('First Name is required'),
    // middleName: Yup.string()
    // .required('Middle Name is required'),
    lastName: Yup.string()
    .required('Last Name is required'),
    // nick_Name: Yup.string()
    // .required('Nick Name is required'),
    contact: Yup.string()
    .required('Contact is required'),

    // introductoryNote: Yup.string()
    // .required('Introductory Note is required'),
    // note: Yup.string()
    // .required('Note is required'),

    dateofBirth: Yup.string()
    .required('Date Of Birth is required'),
    dateofPassing: Yup.string()
    .required('Date Of Passing is required'),


});

export const MakeQRSchema = Yup.object({

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),


});



export const AddTributeSchema = Yup.object().shape({
  tribute: Yup.string().required('Tribute is required'),
});