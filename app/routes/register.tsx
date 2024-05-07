import type {
    ActionFunctionArgs,
    LinksFunction,
    MetaFunction,
  } from "@remix-run/node";
  import {
    Form,
    Link,
    useActionData,
    useSearchParams,
  } from "@remix-run/react";
import { verify } from "crypto";
  
  import stylesUrl from "~/styles/login.css";
  import { db } from "~/utils/db.server";
  import { badRequest } from "~/utils/request.server";
  import {
    createUserSession,
    login,
    register,
  } from "~/utils/session.server";
  
  export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
  ];
  
  export const meta: MetaFunction = () => {
    const description =
      "Login to submit your own jokes to Remix Jokes!";
  
    return [
      { name: "description", content: description },
      { name: "twitter:description", content: description },
      { title: "JukeWorld | Login" },
    ];
  };
  
  function validateUsername(username: string) {
    if (username.length < 3) {
      return "Usernames must be at least 3 characters long";
    }
  }
  
  function validatePassword(password: string) {
    if (password.length < 6) {
      return "Passwords must be at least 6 characters long";
    }
  }
  function validatePasswordVerify(password: string, passwordverify: string) {
    if (password != passwordverify) {
      return "Passwords do not match";
    }
  }
  
  function validateUrl(url: string) {
    const urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
      return url;
    }
    return "/jokes";
  }
  
  export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const password = form.get("password");
    const passwordverify = form.get("passwordverify");
    const username = form.get("username");
    const redirectTo = validateUrl(
      (form.get("redirectTo") as string) || "/"
    );
    if (
      typeof loginType !== "string" ||
      typeof password !== "string" ||
      typeof passwordverify !== "string" ||
      typeof username !== "string"
    ) {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: "Form not submitted correctly.",
      });
    }
  
    let fields = { loginType, password, passwordverify, username };
    const fieldErrors = {
      password: validatePassword(password),
      passwordverify: validatePasswordVerify(password, passwordverify),
      username: validateUsername(username),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({
        fieldErrors,
        fields,
        formError: null,
      });
    }
  
    switch (loginType) {
      case "register": {
        const userExists = await db.user.findFirst({
          where: { username },
        });
        if (userExists) {
          return badRequest({
            fieldErrors: null,
            fields,
            formError: `User with username ${username} already exists`,
          });
        }
        const user = await register({ username, password });
        if (!user) {
          return badRequest({
            fieldErrors: null,
            fields,
            formError:
              "Something went wrong trying to create a new user.",
          });
        }
        return createUserSession(user.id, redirectTo);
      }
      default: {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Login type invalid",
        });
      }
    }
  };
  
  export default function Register() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();
    return (
      <div className="container">
        <div className="content" data-light="">
          <h1>Register</h1>
          <form method="post">
            <input
              type="hidden"
              name="redirectTo"
              value={
                searchParams.get("redirectTo") ?? undefined
              }
            />
            <fieldset>
              <legend className="sr-only">
                Register
              </legend>
              <label>
                <input
                  type="hidden"
                  name="loginType"
                  value="register"
                  defaultChecked={
                    !actionData?.fields?.loginType ||
                    actionData?.fields?.loginType ===
                    "register"
                  }
                />{" "}
              </label>
            </fieldset>
            <div>
              <label htmlFor="username-input">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(
                  actionData?.fieldErrors?.username
                )}
                aria-errormessage={
                  actionData?.fieldErrors?.username
                    ? "username-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(
                  actionData?.fieldErrors?.password
                )}
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
              />

              <label htmlFor="password-input">Re-enter Password</label>
              <input
                id="password-input-verify"
                name="passwordverify"
                type="password"
                defaultValue={actionData?.fields?.passwordverify}
              />

              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}

              {actionData?.fieldErrors?.passwordverify ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.passwordverify}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p
                  className="form-validation-error"
                  role="alert"
                >
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
            <Link to="/login">Have an account? Login</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  