import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_PROJECT_DATABASE_ID ;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECT_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Check for existing document with correct attribute name
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ])
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      const updatePayload = {
        count: typeof doc.count === 'number' ? doc.count + 1 : 1,
      };
      console.log('Updating document:', doc.$id, updatePayload);
      const updateRes = await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, updatePayload);
      console.log('Update response:', updateRes);
      return updateRes;
    } else {
      // Create new document with required attributes and correct types
      const createPayload = {
        searchTerm,
        count: 1,
        movie_id: Number(movie.id),
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      };
      console.log('Creating document with payload:', createPayload);
      const createRes = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), createPayload);
      console.log('Create response:', createRes);
      console.log('this is working')
      return createRes;
    }
  } catch (error) {
    console.error('Error in updateSearchCount:', error);
    if (error.response) {
      console.error('Appwrite error response:', error.response);
    }
    return null;
  }
}

export const getTrendingMovies = async () => {
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count")
  ])

  return result.documents;
 } catch (error) {
  console.error(error);
 }
}