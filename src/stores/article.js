import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '../utils/axios.js'

export const useArticleStore = defineStore('article', () => {
  // State
  const articles = ref([])
  const currentArticle = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  /**
   * Get article by ID from the articles list
   * @param {number} id - Article ID
   * @returns {Object|null} Article object or null
   */
  function getArticleById(id) {
    return articles.value.find(article => article.id === Number(id)) || null
  }

  // Actions
  /**
   * Fetch all articles from the API
   */
  async function fetchArticles() {
    // TODO: request articles, handle errors, and update articles.value
    // TODO: handle loading and error states
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/articles')
      articles.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch articles. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single article by ID from the API
   * @param {number|string} articleId - Article ID
   */
  async function fetchArticleById(articleId) {
    // TODO: request article by ID, handle errors, and update currentArticle.value
    // TODO: handle loading and error states
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/articles/${articleId}`)
      currentArticle.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch article. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    articles,
    currentArticle,
    loading,
    error,
    // Getters
    getArticleById,
    // Actions
    fetchArticles,
    fetchArticleById,
  }
})
