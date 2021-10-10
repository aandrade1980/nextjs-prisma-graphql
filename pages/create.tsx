import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { client } from '@/util/genqlClient';

export default function Create() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState();

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    await client
      .mutation({
        createItem: [
          {
            title,
            description,
            url,
            imageUrl
          },
          { id: true }
        ]
      })
      .then(response => {
        console.log('Response => ', response);
        router.push('/');
      })
      .catch(error => setError(error));
  };

  return (
    <>
      {error && <pre>{error}</pre>}
      <Link href="/">
        <a className="btn">&#8592; Back</a>
      </Link>
      <form onSubmit={handleSubmit}>
        <h2>Create Item</h2>
        <div className="formItem">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="formItem">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="formItem">
          <label htmlFor="url">URL</label>
          <input
            name="url"
            id="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <div className="formItem">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            name="imageUrl"
            id="imageUrl"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit" disabled={title === ''}>
          Create Item
        </button>
      </form>
    </>
  );
}
