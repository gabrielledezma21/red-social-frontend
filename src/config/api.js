const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const localUrl = `http://localhost:${import.meta.env.VITE_API_PORT || "3001"}`;
const productionUrl = "https://anti-social-mongo-4-bits.vercel.app";

export const API_URL = (
  configuredUrl ||
  (window.location.hostname === "localhost" ? localUrl : productionUrl)
).replace(/\/$/, "");

export const apiEndpoints = {
  users: "/users",
  posts: "/posts",
  postsByUser: "/posts/user",
  commentsByUser: "/comments/user",
  comments: "/comments",
  archives: "/archives",
  tags: "/tags",
};
