// utils/slugHelper.js
export class SlugHelper {
  /**
   * Generate slug from title
   * @param {string} title - The title to convert to slug
   * @returns {string} - Generated slug
   */
  static generateSlug(title) {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with single dash
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  }

  /**
   * Validate slug format
   * @param {string} slug - The slug to validate
   * @returns {boolean} - True if valid slug
   */
  static isValidSlug(slug) {
    if (!slug) return false;
    
    // Check if slug matches pattern: lowercase letters, numbers, and dashes only
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length <= 255;
  }

  /**
   * Check if slug exists in database
   * @param {string} slug - The slug to check
   * @param {number} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} - True if slug exists
   */
  static async checkSlugExists(slug, excludeId = null) {
    try {
      const url = new URL('http://localhost/api/check_slug.php');
      url.searchParams.append('slug', slug);
      if (excludeId) {
        url.searchParams.append('exclude_id', excludeId);
      }

      const response = await fetch(url);
      const data = await response.json();
      
      return data.exists || false;
    } catch (error) {
      console.error('Error checking slug:', error);
      return false;
    }
  }

  /**
   * Generate unique slug by adding numbers if needed
   * @param {string} baseSlug - The base slug
   * @param {number} excludeId - ID to exclude from check
   * @returns {Promise<string>} - Unique slug
   */
  static async generateUniqueSlug(baseSlug, excludeId = null) {
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.checkSlugExists(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 1000) {
        throw new Error('Unable to generate unique slug');
      }
    }
    
    return slug;
  }
}

// Example usage in your article form component:
export const useSlugGeneration = (title, articleId = null) => {
  const [slug, setSlug] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slugError, setSlugError] = useState('');

  const generateSlugFromTitle = async () => {
    if (!title.trim()) {
      setSlug('');
      setSlugError('');
      return;
    }

    setIsGenerating(true);
    setSlugError('');

    try {
      const baseSlug = SlugHelper.generateSlug(title);
      
      if (!SlugHelper.isValidSlug(baseSlug)) {
        setSlugError('Judul mengandung karakter yang tidak valid untuk URL');
        return;
      }

      const uniqueSlug = await SlugHelper.generateUniqueSlug(baseSlug, articleId);
      setSlug(uniqueSlug);
    } catch (error) {
      setSlugError('Gagal generate slug: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const validateManualSlug = async (manualSlug) => {
    if (!manualSlug) {
      setSlugError('');
      return true;
    }

    if (!SlugHelper.isValidSlug(manualSlug)) {
      setSlugError('Slug harus berupa huruf kecil, angka, dan tanda strip saja');
      return false;
    }

    const exists = await SlugHelper.checkSlugExists(manualSlug, articleId);
    if (exists) {
      setSlugError('Slug sudah digunakan, silakan pilih yang lain');
      return false;
    }

    setSlugError('');
    return true;
  };

  return {
    slug,
    setSlug,
    isGenerating,
    slugError,
    generateSlugFromTitle,
    validateManualSlug
  };
};