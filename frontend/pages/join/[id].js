import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoCopyOutline } from 'react-icons/io5';
import { useHotkeys } from 'react-hotkeys-hook';
import toast from 'react-hot-toast';

const JoinPoll = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { id } = router.query;

  const handleCopy = () => {
    setCopied(true);
    toast.success('Link copied to clipboard!');
  };

  const castVote = async (pollOptionId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/poll/vote/?poll_option_id=${pollOptionId}&reference_link=${id}`
      );
      console.log(response.data);
      setVoted(!voted);
    } catch (error) {
      console.log(error);
      // TODO: handle error
    }
  };

  useHotkeys('ctrl+c', () => {
    if (poll) {
      navigator.clipboard.writeText(`${window.location.origin}/poll/${poll.reference_link}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
    }
  });

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/poll/join/?reference_link=${id}`);
        setPoll(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        // TODO: handle error
      }
    };
    if (id) {
      fetchPoll();
    }
  }, [router.query, voted]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!poll) {
    return <p>Poll not found</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Poll Question: {poll.title}</h1>
      <ul>
        <label className="mb-2">Options:</label>
        {poll.choices.map((choice, index) => (
          <li
            key={index}
            className="mb-2"
            onClick={() => {
              castVote(choice.id);
            }}
          >
            {choice.text} - {choice.votes} votes
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center">
        <input
          type="text"
          value={`${window.location.origin}/poll/${poll.reference_link}`}
          readOnly
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <CopyToClipboard
          text={`${window.location.origin}/poll/${poll.reference_link}`}
          onCopy={handleCopy}
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline">
            {copied ? <span>Copied!</span> : <IoCopyOutline />}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default JoinPoll;
