import development from './development.config';
const env = 'development';

const config = {
  development,
};

export default config[env];
