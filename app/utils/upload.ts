export const uploadProjectImage = async (file: File) => {
  const supabase = useSupabaseClient();

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `screenshots/${fileName}`

  const { data, error } = await supabase.storage
    .from('project-images')
    .upload(filePath, file)

  if (error) throw error;

  const { data: {publicUrl} } =  supabase.storage
    .from('project-images')
    .getPublicUrl(filePath)

  return publicUrl
}