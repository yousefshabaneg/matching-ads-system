import config from "../config/config";
import AppError from "../helpers/AppError";
import Pagination from "../types/pagination.type";

class HelperFunctions {
  static getPaginationFromQuery(query: any) {
    const currentPage = Number(query.page) || config.defaultPageNumber;
    const limit = Number(query.limit) || config.defaultPageSize;
    const skip = (currentPage - 1) * limit;

    return { currentPage, limit, skip } as Pagination;
  }

  static async getPaginationFromQueryAndModel(
    query: any,
    model: any,
    matchCondition = {}
  ) {
    const pagination = this.getPaginationFromQuery(query);

    const total = await model.countDocuments(matchCondition);
    pagination.total = total;

    const { limit, currentPage, skip } = pagination;

    pagination.numberOfPages = Math.ceil(total / limit);
    const endIndex = currentPage * limit;

    const hasNextPage = endIndex < total;
    const hasPreviousPage = skip > 0;

    if (total !== 0 && pagination.numberOfPages < currentPage) {
      throw AppError.NotFoundException("There is not data in this page");
    }

    if (hasNextPage) {
      pagination.nextPage = currentPage + 1;
    }

    if (hasPreviousPage) {
      pagination.prevPage = currentPage - 1;
    }

    return pagination;
  }

  //a function to selects or picks specific allowedFields fields
  static selectFieldsFromObject(obj: any, ...allowedFields: any) {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
  }

  // Helper function to filter out excluded fields from query
  static excludeFieldsFromQuery(query: any, excludedFields: string[]) {
    const filteredQuery: any = { ...query };
    excludedFields.forEach((field) => delete filteredQuery[field]);
    return filteredQuery;
  }

  // Helper function to replace query operators
  static replaceQueryOperators(query: any) {
    const queryStr: any = JSON.stringify(query);
    return JSON.parse(
      queryStr.replace(
        /\b(gte|gt|lt|lte)\b/gi,
        (match: any) => `$${match.toLowerCase()}`
      )
    );
  }

  // Helper function to extract Sort from Query
  static getSortByFromQuery(query: any) {
    if (!query.sort) return "-createdAt";

    const sort = query.sort as string;

    return sort.split(",").join(" ");
  }

  // Helper function to extract Fields from Query
  static limitFieldsForResponse(query: any) {
    if (!query.fields) return "-__v";

    const fields = query.fields as string;

    return fields.split(",").join(" ");
  }

  // Helper function to get the price tolerance
  static getMinAndMaxPriceTolerance(price: number): {
    minPrice: number;
    maxPrice: number;
  } {
    const priceTolerance = 0.1; //10% for price = 100, min = 90, max = 110
    const minPrice = price * (1 - priceTolerance);
    const maxPrice = price * (1 + priceTolerance);
    return { minPrice: Math.floor(minPrice), maxPrice: Math.floor(maxPrice) };
  }
}

export default HelperFunctions;
