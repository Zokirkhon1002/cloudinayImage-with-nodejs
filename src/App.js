import "./App.css";
import { getImages, searchImages } from "./api";
import { useState, useEffect } from "react";
import NewLoader from "./NewLoader";

function App() {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [searchResult,setSearchResult]=useState(false)
  const [isLoadingLoadMore, setIsLoadingLoadMoe] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    const fetchData = async () => {
      const res = await getImages();
      setImageList(res.resources);
      setSearchResult(true)
      setIsLoading(true)
      setNextCursor(res.next_cursor);
    };
    fetchData();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingLoadMoe(false)
    const resJson = await getImages(nextCursor);
    setImageList((cur) => [...cur, ...resJson.resources]);
    setIsLoadingLoadMoe(true)
    setNextCursor(resJson.next_cursor);
  };

  const handleFormSubmit = async (e) => {
    setIsLoading(false)
    e.preventDefault();
    const resJson = await searchImages(searchValue, nextCursor);
    if(resJson.resources.length){
      setSearchResult(true)
      setImageList(resJson.resources);
      setIsLoading(true)
      setNextCursor(resJson.next_cursor);
    }
    else {
      setSearchResult(false)
      setIsLoading(true)
    }
  };

  const handleResetForm = async () => {
    setSearchResult(true)
    setIsLoading(false)
    const response = await getImages();
    setImageList(response.resources)
    setIsLoading(true)
    setNextCursor(response.next_cursor)

    setSearchValue("")
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} >
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          required="required"
          placeholder="Enter a search value..."
        />
        <button type="submit">Search</button>
        <button onClick={handleResetForm} type="button">Clear</button>
      </form>
      {isLoading ? (
        <div className="image-grid">
          {searchResult ? (imageList?.map((i) => (
            <div key={i.asset_id}><img src={i.url} alt={i.public_id} />
              <div className="textForImage"><p>name: {i.public_id.split("/")[i.public_id.split("/").length -1]}</p></div>
            </div>
          ))):(<h1>There is not '{searchValue}' in Storage</h1>)}
        </div>
      ) : (
        <NewLoader />
      )}
      {isLoadingLoadMore ? (<div className="footer">
        {nextCursor && <button onClick={handleLoadMore}>Load More</button>}
      </div>):(<NewLoader />)}
    </>
  );
}

export default App;
