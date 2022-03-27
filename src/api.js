const API_URL = process.env.REACT_APP_API_URL;

export const getImages = async (nextCursor) => {
    const params = new URLSearchParams();
    if(nextCursor){
        params.append("next_cursor",nextCursor)
    }
    const res = await fetch(`${API_URL}/rasmlar?${params}`);
    const resJson = await res.json();
    return resJson;
}

export const searchImages = async (searchValue,nextCursor) => {
    const params = new URLSearchParams();
    params.append("expression",searchValue)
    if(nextCursor){
        params.append("next_cursor",nextCursor)
    }
    const response = await fetch(`${API_URL}/search?${params}`)
    const resJson = await response.json();
    return resJson;
}

