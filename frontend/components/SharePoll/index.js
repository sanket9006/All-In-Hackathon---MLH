import React, { useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReferenceLink = ({ referenceLink }) => {
  const textAreaRef = useRef(null);

  const handleCopy = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
    toast.success('Reference link copied to clipboard!');
  };

  console.log({ referenceLinkInsideSmall: referenceLink });

  return (
    <div className="flex items-center mt-[50px]">
      {referenceLink != '' && (
        <>
          <textarea
            readOnly
            ref={textAreaRef}
            className="bg-gray-200 rounded mr-2 px-2 py-1 flex-1 text-black max-w-[400px]"
            value={`localhost:3000/join/${referenceLink}`}
          />
          <button
            className="bg-gray-500 hover:bg-gray-600 rounded text-white px-2 py-1"
            onClick={handleCopy}
          >
            <FiCopy className='py-2' size={40}/>
          </button>
        </>
      )}
    </div>
  );
};

export default ReferenceLink;
