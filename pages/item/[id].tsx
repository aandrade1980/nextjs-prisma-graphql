import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';

import { client } from '@/util/genqlClient';

export default function Item() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (id: string) =>
    client.query({
      getOneItem: [
        { id },
        {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          url: true,
          createdAt: true
        }
      ]
    });

  const { data, error } = useSWR([id], fetcher);

  const deleteItem = async (id: string) => {
    await client
      .mutation({
        deleteItem: [{ id }, { id: true }]
      })
      .then(_res => router.push('/'));
  };

  return (
    <div>
      <Link href="/">
        <a className="btn">&#8592; Back</a>
      </Link>
      {error && <p>Oops, something went wrong!</p>}
      {data?.getOneItem && (
        <>
          <h1>{data.getOneItem.title}</h1>
          <p className="description">{data.getOneItem.description}</p>
          {data.getOneItem.imageUrl ? (
            <Image
              src={data.getOneItem.imageUrl}
              height={480}
              width={640}
              alt={data.getOneItem.title}
            />
          ) : (
            <Image
              src="https://user-images.githubusercontent.com/33921841/132140321-01c18680-e304-4069-a0f0-b81a9f6d5cc9.png"
              height={480}
              width={640}
              alt="Never gonna give you up"
            />
          )}
          {data.getOneItem.url && (
            <p className="description">
              <a
                href={data.getOneItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-url"
              >
                Check out item &#8599;
              </a>
            </p>
          )}
          <div>
            <em>
              Created At: {new Date(data.getOneItem?.createdAt).toDateString()}
            </em>
          </div>
          <button
            className="delete"
            onClick={() => deleteItem(data?.getOneItem.id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
