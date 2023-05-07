import { FidgetSpinner } from 'react-loader-spinner';
import s from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={s.overlay}>
      <FidgetSpinner
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
        ballColors={['#01b4e4', '#90cea1', '#ffffff']}
        backgroundColor="#0d253f"
      />
    </div>
  );
};
