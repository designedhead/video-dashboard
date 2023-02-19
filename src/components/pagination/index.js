import React from "react";

// Components
import { Box, Button, Center, HStack, Icon } from "@chakra-ui/react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// interface Props {
//   currentPage: number;
//   total: number;
// }

const getPageNumbers = ({ currentPage, total }) => {
  const pageNumbersToShow = 3;
  const maxPagesBeforeCurrentPage = 1;
  const maxPagesAfterCurrentPage = 1;

  let startPage = 1;
  let endPage = total;

  if (total <= 1) {
    // Don't show numbers if there's only 1 page
    return [];
  }

  if (currentPage <= maxPagesBeforeCurrentPage) {
    // Near the start
    startPage = 1;
    endPage = pageNumbersToShow;
  } else if (currentPage + maxPagesAfterCurrentPage >= total) {
    // Near the end
    startPage = total - pageNumbersToShow + 1;
  } else {
    // Somewhere in the middle
    startPage = currentPage - maxPagesBeforeCurrentPage;
    endPage = currentPage + maxPagesAfterCurrentPage;
  }

  let pageNumbers = Array.from(Array(endPage + 1 - startPage).keys())
    .map((pageNumber) => startPage + pageNumber)
    .filter((pageNumber) => pageNumber <= total && pageNumber > 0);

  if (pageNumbers[0] && pageNumbers[0] > 1) {
    if (pageNumbers[0] <= 2) {
      pageNumbers = [1, ...pageNumbers];
    } else {
      pageNumbers = [1, "...", ...pageNumbers];
    }
  }

  if (pageNumbers[pageNumbers.length - 1] !== total) {
    if (pageNumbers[pageNumbers.length - 1] === total - 1) {
      pageNumbers = [...pageNumbers, total];
    } else {
      pageNumbers = [...pageNumbers, "...", total];
    }
  }

  return pageNumbers;
};

// Export
const Pagination = ({
  onPageChange,
  currentPage,
  nextPage,
  lastPage,
  hasNumbers = true,
}) => {
  const pageNumbers = getPageNumbers({ currentPage, total: lastPage });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (currentPage === 1 && !nextPage) {
    return null;
  }

  return (
    <Box mt={10}>
      <Center flexWrap="wrap">
        <HStack spacing={2}>
          <Button
            display={{ base: "none", md: "inline-flex" }}
            isDisabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            p={2}
          >
            <Icon as={ChevronLeftIcon} />
          </Button>

          {/* Page */}
          {hasNumbers &&
            pageNumbers.map((pageNumber, i) =>
              pageNumber === "..." ? (
                // eslint-disable-next-line
                <Box key={`${pageNumber}${i}`}>
                  <Button isDisabled minW="0" p={0} variant="link">
                    &hellip;
                  </Button>
                </Box>
              ) : (
                // eslint-disable-next-line
                <Box key={`${pageNumber}${i}`}>
                  {pageNumber === currentPage ? (
                    <Button isDisabled p={2}>
                      {pageNumber}
                    </Button>
                  ) : (
                    // eslint-disable-next-line
                    <Button
                      key={`${pageNumber}${i}`}
                      p={2}
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )}
                </Box>
              )
            )}
          {/* /page */}
          <Button
            display={{ base: "none", md: "inline-flex" }}
            isDisabled={!nextPage}
            onClick={() => onPageChange(nextPage)}
            p={2}
          >
            <Icon as={ChevronRightIcon} />
          </Button>
        </HStack>
      </Center>
    </Box>
  );
};

export default Pagination;
