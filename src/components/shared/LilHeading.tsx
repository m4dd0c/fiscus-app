import React from "react";

const LilHeading = ({
  title,
  subTitle,
  className,
}: {
  title: string;
  subTitle?: string;
  className?: string;
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="text-xl font-bold">{title}</h2>
      {subTitle && <h3 className="text-sm opacity-60">{subTitle}</h3>}
    </div>
  );
};

export default LilHeading;
