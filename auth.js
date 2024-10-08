import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./model/user-model";
import bcrypt from "bcryptjs/dist/bcrypt";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials == null) return null;

        try {
          const user = await User.findOne({ email: credentials?.email });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            // console.log("isMatch", isMatch);

            if (isMatch) {
              return user;
            } else {
              throw new Error("User password hasn't matched.");
            }
          } else {
            throw new Error("User not found.");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
});