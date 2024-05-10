import MdxLayout from '../../components/mdx-layout'
import MentorGuide from '../../components/Mentorguide.mdx'

const CustomH1 = ({ children }) => (
  <h1 style={{ fontSize: '3em', margin: 0 }}>{children}</h1>
)

const CustomH2 = ({ children }) => (
  <h2 style={{ margin: '1em 0 0 0' }}>{children}</h2>
)

const CustomH3 = ({ children }) => (
  <h3 style={{ margin: '0.5em 0' }}>{children}</h3>
)

const CustomH4 = ({ children }) => (
  <h4 style={{ fontSize: '1.1em', margin: '1.7em 0 0' }}>{children}</h4>
)

const CustomP = ({ children }) => (
  <p style={{ margin: '1em 0' }}>{children}</p>
)

const overrideComponents = {
  h1: CustomH1,
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
  p: CustomP
}

export default function MentorGuidePage() {
  return <MdxLayout>
    <MentorGuide components={overrideComponents} />
  </MdxLayout>
}