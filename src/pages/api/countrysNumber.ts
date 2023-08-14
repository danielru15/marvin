

interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
export const countries: readonly CountryType[] = [
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AW', label: 'Aruba', phone: '297' },
  { code: 'BO', label: 'Bolivia', phone: '591' },
  { code: 'BR', label: 'Brazil', phone: '55' },
  { code: 'CL', label: 'Chile', phone: '56' },
  { code: 'CO', label: 'Colombia', phone: '57' },
  { code: 'EC', label: 'Ecuador', phone: '593' },
  { code: 'GT', label: 'Guatemala', phone: '502' },
  { code: 'HN', label: 'Honduras', phone: '504' },
  { code: 'MX', label: 'Mexico', phone: '52' },
  { code: 'NI', label: 'Nicaragua', phone: '505' },
  { code: 'PA', label: 'Panama', phone: '507' },
  { code: 'PE', label: 'Peru', phone: '51' },
  { code: 'PY', label: 'Paraguay', phone: '595' },
  { code: 'SV', label: 'El Salvador', phone: '503' },
  {
    code: 'US',
    label: 'United States',
    phone: '1',
    suggested: true,
  },
  { code: 'UY', label: 'Uruguay', phone: '598' },
  { code: 'VE', label: 'Venezuela', phone: '58' },
 
];