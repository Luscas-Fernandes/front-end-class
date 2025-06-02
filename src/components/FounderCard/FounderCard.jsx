import PropTypes from 'prop-types';
import './FounderCard.css';

export default function FounderCard({ name, role, cvLink, imageUrl }) {
  return (
    <div className="founder-container">
      <h2>{name}</h2>
      <p>{role}</p>
      <a href={cvLink} download>Download CV</a>
      <div className="circle-image">
        <img src={imageUrl} alt={`${name} profile`} />
      </div>
    </div>
  );
}

FounderCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  cvLink: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};