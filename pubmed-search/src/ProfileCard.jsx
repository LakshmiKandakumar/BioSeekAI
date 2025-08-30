import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ title, authors, year, abstract, link }) => {
  return (
    <div className="text-card">
      <h2 className="card-title">{title}</h2>
      <p className="card-authors"><span className="card-heading">Authors: </span> {authors}</p>
      <p className="card-year"><span className="card-heading">Year: </span> {year}</p>
      <p className="card-abstract"><span className="card-heading">Abstract: </span> {abstract}</p>
      {link && (
        <p className="card-link"><span className="card-heading">Link: </span> 
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </p>
      )}
    </div>
  );
};

export default ProfileCard;