import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReferenceLink from '@/components/SharePoll';

const CreatePoll = () => {
  const [title, setTitle] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [choices, setChoices] = useState(['', '']);
  console.log({ referenceLink: referenceLink });

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChoiceChange = (index, event) => {
    const newChoices = [...choices];
    newChoices[index] = event.target.value;
    setChoices(newChoices);
  };

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleRemoveChoice = (index) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const choices_payload = choices.map((choice) => {
        return {
          text: choice,
        };
      });
      const response = await axios.post('http://localhost:8000/poll/create/', {
        title,
        choices: choices_payload,
      });

      if (response.data && response.data.data.reference_link) {
        toast.success(`Poll created successfully`);
        console.log(response.data.data.reference_link);
        setReferenceLink(response.data.data.reference_link);
      }
    } catch (error) {
      toast.error('Failed to create poll. Please try again.');
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md mt-[100px]"
      >
        <div className="px-6 py-4">
          <label htmlFor="title" className="block text-black font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter poll title"
            required
          />
        </div>
        <div className="px-6 py-4">
          <label htmlFor="choices" className="block text-black font-bold mb-2">
            Choices
          </label>
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center mb-4">
              <input
                type="text"
                name={`choice${index}`}
                value={choice}
                onChange={(event) => handleChoiceChange(index, event)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`Choice ${index + 1}`}
                required
              />
              {index > 1 && (
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                  onClick={() => handleRemoveChoice(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddChoice}
          >
            Add choice
          </button>
        </div>
        <div className="px-6 py-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Poll
          </button>
        </div>
      </form>
      <div >
        <ReferenceLink referenceLink={referenceLink} />
      </div>
    </div>
  );
};

export default CreatePoll;
