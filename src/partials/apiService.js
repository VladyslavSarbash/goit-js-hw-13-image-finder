export async function fetchUrl(query, page) {
  const response = await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=23120149-b9b49e6d85d17734323f46136`,
  );
  const itemImg = await response.json();
  return itemImg;
}
