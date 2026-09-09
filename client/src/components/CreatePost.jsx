import { useEffect, useRef, useState } from "react";
import {
  ImageOutlined,
  SentimentSatisfiedAltOutlined,
  PollOutlined,
  Close,
  Add,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function CreatePost({ onPostCreated, createPostTrigger }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const profilePicture = user?.profilePicture
    ? `${API_URL}${user.profilePicture}`
    : null;

  const textareaRef = useRef(null);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const [showFeeling, setShowFeeling] = useState(false);
  const [feeling, setFeeling] = useState("");

  const feelings = [
    { emoji: "😊", label: "Happy" },
    { emoji: "❤️", label: "Loved" },
    { emoji: "😎", label: "Excited" },
    { emoji: "🥳", label: "Celebrating" },
    { emoji: "😌", label: "Relaxed" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😴", label: "Tired" },
  ];

  useEffect(() => {
    if (createPostTrigger > 0) {
      textareaRef.current?.focus();

      setIsFocused(true);

      const timer = setTimeout(() => {
        setIsFocused(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [createPostTrigger]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const openPoll = () => {
    setShowPoll((current) => !current);

    if (!showPoll) {
      setShowFeeling(false);
    }
  };

  const openFeeling = () => {
    setShowFeeling((current) => !current);

    if (!showFeeling) {
      setShowPoll(false);
    }
  };

  const selectFeeling = (selectedFeeling) => {
    setFeeling(selectedFeeling);
    setShowFeeling(false);

    textareaRef.current?.focus();
  };

  const removeFeeling = () => {
    setFeeling("");
  };

  const handlePollOptionChange = (index, value) => {
    setPollOptions((currentOptions) =>
      currentOptions.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  };

  const addPollOption = () => {
    if (pollOptions.length >= 4) {
      return;
    }

    setPollOptions((currentOptions) => [
      ...currentOptions,
      "",
    ]);
  };

  const removePollOption = (index) => {
    if (pollOptions.length <= 2) {
      return;
    }

    setPollOptions((currentOptions) =>
      currentOptions.filter(
        (_, optionIndex) => optionIndex !== index
      )
    );
  };

  const removePoll = () => {
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validPollOptions = pollOptions.filter(
      (option) => option.trim()
    );

    if (
      !text.trim() &&
      !image &&
      !pollQuestion.trim() &&
      !feeling
    ) {
      alert("Please add some text, an image, a poll, or a feeling.");
      return;
    }

    if (showPoll) {
      if (!pollQuestion.trim()) {
        alert("Please enter a poll question.");
        return;
      }

      if (validPollOptions.length < 2) {
        alert("Please add at least two poll options.");
        return;
      }
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    let finalText = text.trim();

    if (feeling) {
      const feelingText = `${feeling.emoji} Feeling ${feeling.label}`;

      finalText = finalText
        ? `${finalText}\n\n${feelingText}`
        : feelingText;
    }

    if (showPoll) {
      const pollText = `📊 ${pollQuestion.trim()}\n${validPollOptions
        .map(
          (option, index) =>
            `${index + 1}. ${option.trim()}`
        )
        .join("\n")}`;

      finalText = finalText
        ? `${finalText}\n\n${pollText}`
        : pollText;
    }

    const data = new FormData();

    data.append("text", finalText);

    if (image) {
      data.append("image", image);
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setText("");
      setImage(null);
      setImagePreview(null);

      setShowPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);

      setShowFeeling(false);
      setFeeling("");

      if (onPostCreated) {
        onPostCreated(result.post);
      }
    } catch (error) {
      console.error("Create post error:", error);
      alert("Something went wrong while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`create-post-card ${
        isFocused ? "create-post-focused" : ""
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div className="create-post-top">
          <div className="avatar create-post-avatar">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={user?.name || "Profile"}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <textarea
            ref={textareaRef}
            placeholder={`What's on your mind, ${
              user?.name || "User"
            }?`}
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {feeling && (
          <div className="selected-feeling">
            <span>
              {feeling.emoji} Feeling {feeling.label}
            </span>

            <button
              type="button"
              onClick={removeFeeling}
            >
              <Close />
            </button>
          </div>
        )}

        {showFeeling && (
          <div className="feeling-picker">
            <div className="feeling-picker-header">
              <div>
                <strong>How are you feeling?</strong>
                <span>Choose what matches your mood</span>
              </div>

              <button
                type="button"
                className="feeling-close"
                onClick={() => setShowFeeling(false)}
              >
                <Close />
              </button>
            </div>

            <div className="feeling-grid">
              {feelings.map((item) => (
                <button
                  type="button"
                  className="feeling-item"
                  key={item.label}
                  onClick={() => selectFeeling(item)}
                >
                  <span>{item.emoji}</span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {showPoll && (
          <div className="poll-builder">
            <div className="poll-builder-header">
              <div>
                <strong>Create a Poll</strong>
                <span>Ask your community a question</span>
              </div>

              <button
                type="button"
                className="poll-close"
                onClick={removePoll}
              >
                <Close />
              </button>
            </div>

            <input
              className="poll-question"
              type="text"
              placeholder="Ask a question..."
              value={pollQuestion}
              onChange={(e) =>
                setPollQuestion(e.target.value)
              }
              maxLength={200}
            />

            <div className="poll-options">
              {pollOptions.map((option, index) => (
                <div
                  className="poll-option-row"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      handlePollOptionChange(
                        index,
                        e.target.value
                      )
                    }
                    maxLength={100}
                  />

                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      className="poll-delete"
                      onClick={() =>
                        removePollOption(index)
                      }
                    >
                      <Close />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {pollOptions.length < 4 && (
              <button
                type="button"
                className="poll-add-option"
                onClick={addPollOption}
              >
                <Add />
                Add option
              </button>
            )}
          </div>
        )}

        {imagePreview && (
          <div className="post-image-preview">
            <img
              src={imagePreview}
              alt="Post preview"
            />

            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
            >
              <Close />
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <label className="create-action">
            <ImageOutlined />
            Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <button
            type="button"
            className={`create-action ${
              showPoll ? "create-action-active" : ""
            }`}
            onClick={openPoll}
          >
            <PollOutlined />
            Poll
          </button>

          <button
            type="button"
            className={`create-action ${
              showFeeling ? "create-action-active" : ""
            }`}
            onClick={openFeeling}
          >
            <SentimentSatisfiedAltOutlined />
            Feeling
          </button>

          <button
            type="submit"
            className="post-button"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post →"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePost;