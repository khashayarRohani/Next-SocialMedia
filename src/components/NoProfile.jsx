import ProfileForm from "./ProfileForm";

export default function NoProfile() {
  return (
    <div style={{ padding: "2%" }}>
      <p style={{ color: "red", fontWeight: 900 }}>
        Please Compelete your profile
      </p>
      <ProfileForm />
    </div>
  );
}
