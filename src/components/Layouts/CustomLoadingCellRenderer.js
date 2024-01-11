import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function LoadingComponent() {
  return (
    <div className="ag-custom-loading-cell" style={{ lineHeight: '40px' }}>
      <FontAwesomeIcon icon={faSpinner} spin />
      <span> One moment please ...</span>
    </div>
  );
};
