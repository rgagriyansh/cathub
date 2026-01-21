// MBA Profile Types

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | ''
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews' | ''
  city: string
  state: string
}

export interface AcademicRecord {
  level: '10th' | '12th' | 'graduation' | 'post_graduation'
  institution: string
  board_university: string
  stream_branch: string
  percentage_cgpa: string
  year_of_completion: string
}

export interface EntranceScore {
  examName: string
  overallScore: string
  overallPercentile: string
  sectionalScores?: {
    section: string
    score: string
    percentile: string
  }[]
  year: string
}

export interface WorkExperience {
  id: string
  companyName: string
  designation: string
  industry: string
  startDate: string
  endDate: string
  isCurrentRole: boolean
  responsibilities: string
  achievements: string
}

export interface Activity {
  id: string
  name: string
  type: 'extra_curricular' | 'co_curricular'
  level: 'school' | 'college' | 'state' | 'national' | 'international'
  duration: string
  description: string
  achievements: string
}

export interface Achievement {
  id: string
  title: string
  year: string
  issuingOrganization: string
  description: string
  type: 'academic' | 'professional' | 'sports' | 'cultural' | 'social' | 'other'
}

export interface Certification {
  id: string
  name: string
  issuingOrganization: string
  year: string
  credentialId?: string
}

export interface CareerGoals {
  shortTermGoals: string
  longTermGoals: string
  whyMba: string
  targetSchools: string[]
  preferredSpecialization: string[]
}

export interface AdditionalInfo {
  hobbies: string
  languages: string[]
  socialProjects: string
  publications: string
  patents: string
  otherInfo: string
}

export interface MBAProfile {
  id?: string
  userId: string
  personalInfo: PersonalInfo
  academics: AcademicRecord[]
  entranceScores: EntranceScore[]
  workExperience: WorkExperience[]
  activities: Activity[]
  achievements: Achievement[]
  certifications: Certification[]
  careerGoals: CareerGoals
  additionalInfo: AdditionalInfo
  createdAt?: string
  updatedAt?: string
}

// Default empty profile
export const defaultProfile: Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    category: '',
    city: '',
    state: '',
  },
  academics: [
    { level: '10th', institution: '', board_university: '', stream_branch: '', percentage_cgpa: '', year_of_completion: '' },
    { level: '12th', institution: '', board_university: '', stream_branch: '', percentage_cgpa: '', year_of_completion: '' },
    { level: 'graduation', institution: '', board_university: '', stream_branch: '', percentage_cgpa: '', year_of_completion: '' },
  ],
  entranceScores: [
    {
      examName: 'CAT',
      overallScore: '',
      overallPercentile: '',
      sectionalScores: [
        { section: 'VARC', score: '', percentile: '' },
        { section: 'DILR', score: '', percentile: '' },
        { section: 'QA', score: '', percentile: '' },
      ],
      year: '',
    },
  ],
  workExperience: [],
  activities: [],
  achievements: [],
  certifications: [],
  careerGoals: {
    shortTermGoals: '',
    longTermGoals: '',
    whyMba: '',
    targetSchools: [],
    preferredSpecialization: [],
  },
  additionalInfo: {
    hobbies: '',
    languages: [],
    socialProjects: '',
    publications: '',
    patents: '',
    otherInfo: '',
  },
}

// List of MBA specializations
export const MBA_SPECIALIZATIONS = [
  'Finance',
  'Marketing',
  'Operations',
  'Human Resources',
  'Strategy',
  'Consulting',
  'Entrepreneurship',
  'Business Analytics',
  'Information Technology',
  'International Business',
  'Supply Chain Management',
  'Healthcare Management',
]

// List of popular MBA schools in India
export const MBA_SCHOOLS = [
  'IIM Ahmedabad',
  'IIM Bangalore',
  'IIM Calcutta',
  'IIM Lucknow',
  'IIM Kozhikode',
  'IIM Indore',
  'ISB Hyderabad',
  'XLRI Jamshedpur',
  'FMS Delhi',
  'MDI Gurgaon',
  'SPJIMR Mumbai',
  'IIM Shillong',
  'IIM Trichy',
  'IIM Raipur',
  'IIM Ranchi',
  'IIM Kashipur',
  'IIM Udaipur',
  'NITIE Mumbai',
  'JBIMS Mumbai',
  'IIFT Delhi',
  'SIBM Pune',
  'SCMHRD Pune',
  'NMIMS Mumbai',
  'Great Lakes Chennai',
  'MICA Ahmedabad',
  'TISS Mumbai',
  'IMT Ghaziabad',
  'IIT Delhi (DMS)',
  'IIT Bombay (SJMSOM)',
  'IIT Kharagpur (VGSOM)',
]

// Indian states for dropdown
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]
