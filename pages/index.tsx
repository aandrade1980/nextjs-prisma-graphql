import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';

import { client } from '@/util/genqlClient';

export default function Home() {
  const fetcher = () =>
    client.query({
      getItems: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true
      }
    });

  const { data, error } = useSWR('getItems', fetcher);

  return (
    <div>
      <div className="right">
        <Link href="/create">
          <a className="btn">Create Item &#8594;</a>
        </Link>
      </div>
      {error && <p>Oops, something went wrong!</p>}
      <ul>
        {data?.getItems &&
          data.getItems.map(item => (
            <li key={item.id}>
              <Link href={`/item/${item.id}`}>
                <a>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      height={480}
                      width={640}
                      alt={item.title}
                    />
                  ) : (
                    <Image
                      src="https://user-images.githubusercontent.com/33921841/132140321-01c18680-e304-4069-a0f0-b81a9f6d5cc9.png"
                      height={480}
                      width={640}
                      alt="Never gonna give you up"
                    />
                  )}
                  <h2>{item.title}</h2>
                  <p>{item?.description || 'No description available'}</p>
                  <p>Created At: {new Date(item?.createdAt).toDateString()}</p>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
