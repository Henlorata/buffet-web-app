interface User {
  id: string;
  name: string;
  email: string;
  func: string;
  img_url: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export default User;