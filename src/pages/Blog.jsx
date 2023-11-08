import React from "react";
import { blogPosts } from "../data/blogData";
import ScrollToTopButton from "../components/ScrollToTopButton";

export const BlogCard = ({ title, author, date, content }) => {
  const paragraphs = content.split("\n");

  return (
    <div className="bg-teal-900 rounded-xl shadow-md overflow-hidden m-10 mb-4">
      <div className="md:flex">
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-yellow-600 font-semibold">
              {author.name}
            </div>
            <h2 className="mt-2 text-2xl leading-7 font-semibold text-gray-300 mb-8">
              {title}
            </h2>

            <div className="md:flex-shrink-0">
              <img
                className="h-58 w-48 object-cover md:w-72"
                src={author.avatar}
                alt={author.name}
              />
            </div>
            <p className="mt-3 text-base text-gray-400">{date}</p>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mt-4 text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <>
      <div className="bg-teal-900  text-neutral-200">
        <div className="w-full py-[5rem] px-4 bg-teal-800  text-black">
          <div className="] mx-auto  gap-10 mt-10">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                author={post.author}
                date={post.date}
                content={post.content}
              />
            ))}
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Blog;
