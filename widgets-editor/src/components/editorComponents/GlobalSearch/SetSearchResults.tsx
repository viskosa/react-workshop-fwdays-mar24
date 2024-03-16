import { useEffect, useCallback, useRef, useMemo, memo } from "react";
import { connectHits } from "react-instantsearch-dom";
import { Hit as IHit } from "react-instantsearch-core";
import { debounce } from "lodash";
import { DocSearchItem, SearchItem, SEARCH_ITEM_TYPES } from "./utils";

type Props = {
  setDocumentationSearchResults: (item: DocSearchItem) => void;
  hits: IHit[];
};

const SearchResults = ({ hits, setDocumentationSearchResults }: Props) => {
  const previousFilteredHits = useRef<IHit[]>([]);
  const debounsedSetter = useCallback(
    debounce(setDocumentationSearchResults, 100),
    [],
  );

  const filteredHits = useMemo(
    () =>
      hits.filter((doc: SearchItem) => doc.kind === SEARCH_ITEM_TYPES.document),
    [hits],
  );

  const memoizedFilteredHits = useMemo(() => {
    return filteredHits;
  }, [filteredHits.map((i) => i.objectID).join(",")]);

  useEffect(() => {
    const filteredHits = hits.filter(
      (doc: SearchItem) => doc.kind === SEARCH_ITEM_TYPES.document,
    );
    // → shallow equal
    // → compare ids ← this one
    // → deep equal
    if (
      filteredHits.length === previousFilteredHits.current.length &&
      filteredHits.every(
        (hit, index) =>
          hit.objectID === previousFilteredHits.current[index].objectID,
      )
    ) {
      return;
    } else {
      previousFilteredHits.current = filteredHits;

      debounsedSetter(filteredHits as any);
    }
  }, [hits]);

  return null;
};

// const MemoizedSearchResults = memo(SearchResults, (prevProps, nextProps) => {
//   // shallow-compare or id-compare the hits
// });

export default connectHits<Props, IHit>(SearchResults);
