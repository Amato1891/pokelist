const Pagination = ({ items, pageSize, onPageChange }) => {
    const { Button } = ReactBootstrap;
    if (items.length <= 1) return null;
  
    let num = Math.ceil(items.length / pageSize);
    let pages = range(1, num + 1);
    const list = pages.map(page => {
      return (
        <Button key={page} onClick={onPageChange} className="page-item">
          {page}
        </Button>
      );
    });
    return (
      <nav>
        <ul className="pagination">{list}</ul>
      </nav>
    );
  };
  
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill(0)
      .map((item, i) => start + i);
  };
  function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
  }
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData
    });
  
    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  };
  // App that gets data from Pokemon API
  function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const[pageSize, setPageSize] = useState(25);
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "https://pokeapi.co/api/v2/pokemon/?limit=151",
      {
        results: []
      }
    );
    console.log(data)
    const handlePageSize = (event) => {
      setPageSize(event.target.value);
      setCurrentPage(1);
    };;

    
    const linkToPokedex=  e => {
     let link = e.target.innerHTML;
     window.location = `https://www.pokemon.com/us/pokedex/${link}`
      console.log(link)
    }
    const handlePageChange = e => {
      setCurrentPage(Number(e.target.textContent));
    };
    let page = data.results;
    if (page.length >= 1) {
      page = paginate(page, currentPage, pageSize);
      console.log(`currentPage: ${currentPage}`);
    }
    return (
      <Fragment>
        <form
          onSubmit={event => {
            doFetch(`https://pokeapi.co/api/v2/pokemon/?limit=${query}/`);
            event.preventDefault();
          }}
        >
          <input
          placeholder="# of pokemon to return"
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <button type="submit">Go!</button>
        </form>
  
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <ul>
            {page.map((item, index) => ( 
              <li key={index}>
                <div onClick={linkToPokedex}>
              {item.name}
              </div>
              </li>
             ))}
          </ul>
        )}
         
        <Pagination
          items={data.results}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        ></Pagination>
        <select onChange = {(e) => handlePageSize(e)}>
          <option value = '25'>25</option>
          <option value = '50'>50</option>
          <option value = '75'>75</option>
        </select>
      </Fragment>
    );
  }
  
  // ========================================
  ReactDOM.render(<App />, document.getElementById("root"));
  